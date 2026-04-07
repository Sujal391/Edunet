import { API_PROXY_BASE, API_ENDPOINTS } from "./config";
import { LoginRequest, LoginResponse } from "../types";

// All requests go through the Next.js proxy at /api/proxy/...
// The proxy handles: Bearer token injection, token storage, and refresh.
const PROXY = API_PROXY_BASE;

// ─── Login ────────────────────────────────────────────────────────────────────

/**
 * POST /api/proxy/access/ — authenticate via the Next.js proxy.
 * The proxy captures the JWT tokens from the backend's Set-Cookie headers
 * and stores them in HttpOnly cookies on the localhost domain.
 */
export async function loginUser(credentials: LoginRequest): Promise<LoginResponse> {
  const url = `${PROXY}${API_ENDPOINTS.LOGIN}`;

  const response = await fetch(url, {
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

  return response.json() as Promise<LoginResponse>;
}

// ─── Token Refresh ────────────────────────────────────────────────────────────

let isRefreshing = false;
let refreshSubscribers: Array<(ok: boolean) => void> = [];

function onRefreshDone(success: boolean) {
  refreshSubscribers.forEach((cb) => cb(success));
  refreshSubscribers = [];
}

/**
 * POST /api/proxy/refresh/ — the proxy automatically reads the stored
 * refresh token and injects it into the request body before forwarding.
 */
export async function refreshToken(): Promise<boolean> {
  try {
    const url = `${PROXY}${API_ENDPOINTS.REFRESH}`;
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });
    return response.ok;
  } catch {
    return false;
  }
}

// ─── Authenticated Fetch ──────────────────────────────────────────────────────

/**
 * Drop-in replacement for `fetch()` that routes through the Next.js proxy.
 * The proxy automatically adds the Authorization: Bearer header using the
 * HttpOnly access token stored on the server side.
 *
 * On 401, calls /refresh/ once and retries.
 * If refresh also fails, redirects to /login.
 */
export async function fetchWithAuth(
  input: RequestInfo | URL,
  init: RequestInit = {}
): Promise<Response> {
  // Route through the proxy: replace the backend base URL with the proxy path
  const proxyInput = toProxyUrl(String(input));

  let response = await fetch(proxyInput, init);

  if (response.status !== 401) return response;

  // ── Access token expired — refresh ──
  if (isRefreshing) {
    await new Promise<boolean>((resolve) => refreshSubscribers.push(resolve));
    response = await fetch(proxyInput, init);
    return response;
  }

  isRefreshing = true;
  const refreshed = await refreshToken();
  isRefreshing = false;
  onRefreshDone(refreshed);

  if (!refreshed) {
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
    return response;
  }

  // Retry — the proxy will use the fresh token automatically
  response = await fetch(proxyInput, init);
  return response;
}

// ─── URL Converter ────────────────────────────────────────────────────────────

/**
 * Convert an absolute backend URL like:
 *   https://school-management-system-sms-y2jr.onrender.com/api/SchoolView/
 * to a proxy URL like:
 *   /api/proxy/SchoolView/
 */
function toProxyUrl(url: string): string {
  // If already a proxy URL or relative, return as-is
  if (url.startsWith("/api/proxy")) return url;

  // Extract the path after /api/
  const match = url.match(/\/api\/(.+)$/);
  if (match) return `${PROXY}/${match[1]}`;

  return url;
}

// ─── Logout ───────────────────────────────────────────────────────────────────

export async function logoutUser(): Promise<void> {
  try {
    // Attempt backend logout via proxy (clears server-side cookies)
    await fetch(`${PROXY}/logout/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });
  } catch { /* ignore */ }

  if (typeof window !== "undefined") {
    window.location.href = "/login";
  }
}

// ─── Role → Route ─────────────────────────────────────────────────────────────

export function getDashboardRoute(roles: string[]): string {
  const role = roles?.[0]?.toLowerCase() ?? "";
  if (role === "super_admin")                    return "/superadmin";
  if (role === "trustee")                        return "/trustee";
  if (role === "principal")                      return "/principal";
  if (role === "librarian")                      return "/librarian";
  if (role === "clerk" || role === "fees_clerk") return "/clerk";
  return "/";
}