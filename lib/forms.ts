import { API_BASE_URL, API_ENDPOINTS } from "./config"
import { fetchWithAuth } from "./auth"
import type {
  AdmissionFormCreatePayload,
  AdmissionFormResponse,
  PublicAdmissionForm,
} from "./form-builder-config"

const FORMS_URL = `${API_BASE_URL}${API_ENDPOINTS.FORMS}`

export async function getAdmissionForms(): Promise<AdmissionFormResponse[]> {
  const response = await fetchWithAuth(FORMS_URL)

  if (!response.ok) {
    let message = "Failed to fetch forms."
    try {
      const err = await response.json()
      message = err?.detail || err?.message || message
    } catch {
      // Ignore malformed error bodies.
    }
    throw new Error(message)
  }

  const data = await response.json()
  // Handle both paginated { results: [...] } and plain array responses
  return Array.isArray(data) ? data : (data.results ?? [])
}

export async function createAdmissionForm(
  payload: AdmissionFormCreatePayload
): Promise<AdmissionFormResponse> {
  const response = await fetchWithAuth(FORMS_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    let message = "Failed to create form."
    try {
      const err = await response.json()
      const fieldErrors = Object.values(err || {})
        .flat()
        .filter((value): value is string => typeof value === "string")
      message = err?.detail || err?.message || fieldErrors[0] || message
    } catch {
      // Ignore malformed error bodies.
    }
    throw new Error(message)
  }

  return response.json()
}

export async function getPublicFormFields(): Promise<PublicAdmissionForm[]> {
  const url = `${API_BASE_URL}${API_ENDPOINTS.FIELDS}`
  const response = await fetch(url) // Note: Public fetch

  if (!response.ok) {
    let message = "Failed to fetch form fields."
    try {
      const err = await response.json()
      message = err?.detail || err?.message || message
    } catch {
      // Ignore
    }
    throw new Error(message)
  }

  const data = await response.json()
  return Array.isArray(data) ? data : (data.results ?? [])
}

export interface SchoolClass {
  school_class: string
}

export async function getSchoolClasses(): Promise<SchoolClass[]> {
  const url = `${API_BASE_URL}${API_ENDPOINTS.CLASSES}`
  const response = await fetch(url)

  if (!response.ok) {
    let message = "Failed to fetch classes."
    try {
      const err = await response.json()
      message = err?.detail || err?.message || message
    } catch {
      // Ignore
    }
    throw new Error(message)
  }

  const data = await response.json()
  const rawClasses = Array.isArray(data) ? data : (data.results ?? [])
  
  // Deduplicate by school_class name
  const uniqueClasses = Array.from(
    new Map(rawClasses.map((item: any) => [item.school_class, item])).values()
  ) as SchoolClass[]

  return uniqueClasses
}

export async function toggleFormStatus(formId: number): Promise<void> {
  const url = `${API_BASE_URL}${API_ENDPOINTS.FORM_STATUS}${formId}/`
  const response = await fetchWithAuth(url, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
  })

  if (!response.ok) {
    let message = "Failed to update form status."
    try {
      const err = await response.json()
      message = err?.detail || err?.message || message
    } catch {
      // Ignore
    }
    throw new Error(message)
  }
}

export async function getPublishedFormLink(): Promise<{ form_link: string }> {
  const url = `${API_BASE_URL}${API_ENDPOINTS.FORM_LINK}`
  const response = await fetch(url)

  if (!response.ok) {
    let message = "Failed to fetch form link."
    try {
      const err = await response.json()
      message = err?.detail || err?.message || message
    } catch {
      // Ignore
    }
    throw new Error(message)
  }

  return response.json()
}
