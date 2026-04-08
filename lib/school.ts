import { API_BASE_URL, API_ENDPOINTS } from "./config";
import { School, CreateSchoolPayload, CreateSchoolResponse } from "../types";
import { fetchWithAuth } from "./auth";

const SCHOOL_URL = `${API_BASE_URL}${API_ENDPOINTS.SCHOOL}`;

/**
 * GET /SchoolView/ — fetch all schools from the backend.
 * Uses fetchWithAuth so the token is silently refreshed on 401.
 */
export async function getSchools(): Promise<School[]> {
  const response = await fetchWithAuth(SCHOOL_URL, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch schools.");
  }

  const data = await response.json();
  return Array.isArray(data) ? data : data.results ?? [];
}

/**
 * POST /SchoolView/ — create a new school entry.
 * Uses fetchWithAuth so the token is silently refreshed on 401.
 */
export async function createSchool(
  payload: CreateSchoolPayload
): Promise<CreateSchoolResponse> {
  const response = await fetchWithAuth(SCHOOL_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    let message = "Failed to create school.";
    try {
      const err = await response.json();
      const fieldErrors = Object.values(err || {})
        .flat()
        .filter((value): value is string => typeof value === "string");
      message = err?.detail || err?.message || fieldErrors[0] || message;
    } catch { /* ignore */ }
    throw new Error(message);
  }

  return response.json();
}
