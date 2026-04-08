import { API_BASE_URL, API_ENDPOINTS } from "./config";
import { LoginRequest, LoginResponse } from "../types";

// ─── Token Management ─────────────────────────────────────────────────────────

const COOKIE_FETCH_OPTIONS: Pick<RequestInit, "credentials"> = {
  credentials: "include",
};

function apiFetch(input: RequestInfo | URL, init: RequestInit = {}) {
  return fetch(input, {
    ...COOKIE_FETCH_OPTIONS,
    ...init,
  });
}

function getAccessToken(): string | null {
  if (typeof window !== "undefined") {
    const directToken = localStorage.getItem("access_token");
    if (directToken) return directToken;
    const plainToken = localStorage.getItem("token");
    if (plainToken) return plainToken;
    const altToken = localStorage.getItem("authToken");
    if (altToken) return altToken;

    // Fallback for persisted stores that keep auth under { state: { token } }.
    for (let i = 0; i < localStorage.length; i += 1) {
      const key = localStorage.key(i);
      if (!key) continue;

      const raw = localStorage.getItem(key);
      if (!raw) continue;

      try {
        const parsed = JSON.parse(raw) as { state?: { token?: unknown }; token?: unknown };
        const nestedToken = parsed?.state?.token;
        if (typeof nestedToken === "string" && nestedToken.length > 0) {
          return nestedToken;
        }

        const flatToken = parsed?.token;
        if (typeof flatToken === "string" && flatToken.length > 0) {
          return flatToken;
        }
      } catch {
        // Ignore non-JSON values in localStorage.
      }
    }
  }
  return null;
}

function getRefreshToken(): string | null {
  if (typeof window !== "undefined") {
    return localStorage.getItem("refresh_token");
  }
  return null;
}

function setTokens(access: string, refresh?: string | null) {
  if (typeof window !== "undefined") {
    localStorage.setItem("access_token", access);
    if (typeof refresh === "string" && refresh.length > 0) {
      localStorage.setItem("refresh_token", refresh);
    }
  }
}

function clearTokens() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
  }
}

// ─── Login ────────────────────────────────────────────────────────────────────

export async function loginUser(credentials: LoginRequest): Promise<LoginResponse> {
  const url = `${API_BASE_URL}${API_ENDPOINTS.LOGIN}`;

  const response = await apiFetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    let message = "Invalid username or password.";
    try {
      const err = await response.json();
      message = err?.detail || err?.message || message;
    } catch { /* ignore */ }
    throw new Error(message);
  }

  const data = await response.json() as LoginResponse & { token?: string };
  const accessToken = data.access || data.token;

  if (accessToken) {
    setTokens(accessToken, data.refresh);
  }

  return data;
}

// ─── Token Refresh ────────────────────────────────────────────────────────────

let isRefreshing = false;
let refreshSubscribers: Array<(ok: boolean) => void> = [];

function onRefreshDone(success: boolean) {
  refreshSubscribers.forEach((cb) => cb(success));
  refreshSubscribers = [];
}

export async function refreshToken(): Promise<boolean> {
  const refresh = getRefreshToken();
  const requestBody = refresh ? JSON.stringify({ refresh }) : undefined;

  try {
    const url = `${API_BASE_URL}${API_ENDPOINTS.REFRESH}`;
    const response = await apiFetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: requestBody,
    });
    
    if (response.ok) {
        const data = await response.json();
        const newAccess = data.access || data.token;
        const newRefresh = data.refresh || refresh;
        if (newAccess) {
            setTokens(newAccess, newRefresh);
            return true;
        }
    }
    return false;
  } catch {
    return false;
  }
}

// ─── Authenticated Fetch ──────────────────────────────────────────────────────

export async function fetchWithAuth(
  input: RequestInfo | URL,
  init: RequestInit = {}
): Promise<Response> {
  const url = String(input);

  const token = getAccessToken();
  const headers = new Headers(init.headers);
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await apiFetch(url, {
    ...init,
    headers,
  });

  if (response.status !== 401) return response;

  if (isRefreshing) {
    await new Promise<boolean>((resolve) => refreshSubscribers.push(resolve));
    
    const newToken = getAccessToken();
    const newHeaders = new Headers(init.headers);
    if (newToken) {
        newHeaders.set("Authorization", `Bearer ${newToken}`);
    }
    return apiFetch(url, {
      ...init,
      headers: newHeaders,
    });
  }

  isRefreshing = true;
  const refreshed = await refreshToken();
  isRefreshing = false;
  onRefreshDone(refreshed);

  if (!refreshed) {
    clearTokens();
    return response;
  }

  const freshToken = getAccessToken();
  const retryHeaders = new Headers(init.headers);
  if (freshToken) {
    retryHeaders.set("Authorization", `Bearer ${freshToken}`);
  }
  return apiFetch(url, {
    ...init,
    headers: retryHeaders,
  });
}

// ─── Logout ───────────────────────────────────────────────────────────────────

export async function logoutUser(): Promise<void> {
  const token = getAccessToken();
  const headers: HeadersInit = { "Content-Type": "application/json" };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  try {
    await apiFetch(`${API_BASE_URL}/logout/`, {
      method: "POST",
      headers,
    });
  } catch { /* ignore */ }

  clearTokens();

  if (typeof window !== "undefined") {
    window.location.href = "/login";
  }
}

// ─── Role → Route ─────────────────────────────────────────────────────────────

export function getDashboardRoute(roles: string[]): string {
  const role = roles?.[0]?.toLowerCase() ?? "";
  if (role === "super_admin") return "/superadmin";
  if (role === "trustee") return "/trustee";
  if (role === "principal") return "/principal";
  if (role === "librarian") return "/librarian";
  if (role === "clerk" || role === "fees_clerk") return "/clerk";
  return "/";
}
