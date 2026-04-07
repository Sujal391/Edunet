import { API_BASE_URL, API_ENDPOINTS } from "./config";
import { LoginRequest, LoginResponse } from "../types";

// ─── Token Management ─────────────────────────────────────────────────────────

const COOKIE_FETCH_OPTIONS: Pick<RequestInit, "credentials"> = {
  credentials: "include",
};

function getAccessToken(): string | null {
  if (typeof window !== "undefined") {
    return localStorage.getItem("access_token");
  }
  return null;
}

function getRefreshToken(): string | null {
  if (typeof window !== "undefined") {
    return localStorage.getItem("refresh_token");
  }
  return null;
}

function setTokens(access: string, refresh: string) {
  if (typeof window !== "undefined") {
    localStorage.setItem("access_token", access);
    localStorage.setItem("refresh_token", refresh);
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

  const response = await fetch(url, {
    ...COOKIE_FETCH_OPTIONS,
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

  const data = await response.json() as LoginResponse;
  
  if (data.access && data.refresh) {
    setTokens(data.access, data.refresh);
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
    const response = await fetch(url, {
      ...COOKIE_FETCH_OPTIONS,
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: requestBody,
    });
    
    if (response.ok) {
        const data = await response.json();
        const newAccess = data.access;
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

  const response = await fetch(url, {
    ...COOKIE_FETCH_OPTIONS,
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
    return fetch(url, {
      ...COOKIE_FETCH_OPTIONS,
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
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
    return response;
  }

  const freshToken = getAccessToken();
  const retryHeaders = new Headers(init.headers);
  if (freshToken) {
    retryHeaders.set("Authorization", `Bearer ${freshToken}`);
  }
  return fetch(url, {
    ...COOKIE_FETCH_OPTIONS,
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
    await fetch(`${API_BASE_URL}/logout/`, {
      ...COOKIE_FETCH_OPTIONS,
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
