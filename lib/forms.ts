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
  // Handle both paginated { results: [...] }, wrapped { data: [...] }, and plain array responses
  return Array.isArray(data) ? data : (data.data ?? data.results ?? [])
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
  return Array.isArray(data) ? data : (data.data ?? data.results ?? [])
}

export interface SchoolClass {
  id: number
  school_class: string
}

export async function getSchoolClasses(): Promise<SchoolClass[]> {
  const url = `${API_BASE_URL}${API_ENDPOINTS.SCHOOL_CLASS}`
  const response = await fetchWithAuth(url)

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
  return Array.isArray(data) ? data : (data.data ?? data.results ?? [])
}

export async function deleteSchoolClass(id: number): Promise<void> {
  const url = `${API_BASE_URL}${API_ENDPOINTS.SCHOOL_CLASS}${id}/`
  const response = await fetchWithAuth(url, {
    method: "DELETE",
  })

  if (!response.ok) {
    let message = "Failed to delete class."
    try {
      const err = await response.json()
      message = err?.detail || err?.message || message
    } catch {
      // Ignore
    }
    throw new Error(message)
  }
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

  const data = await response.json()
  
  // If the backend returns a relative URL, prepend the API_BASE_URL
  if (data.form_link && data.form_link.startsWith("/")) {
    const baseUrl = (API_BASE_URL || "").endsWith("/") 
      ? API_BASE_URL?.slice(0, -1) 
      : API_BASE_URL
    data.form_link = `${baseUrl}${data.form_link}`
  }

  return data
}

export async function saveSchoolClasses(classes: string[]): Promise<void> {
  const url = `${API_BASE_URL}${API_ENDPOINTS.SCHOOL_CLASS}`
  const payload = classes.map((c) => ({ school_class: c }))
  const response = await fetchWithAuth(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    let message = "Failed to save classes."
    try {
      const err = await response.json()
      message = err?.detail || err?.message || message
    } catch {
      // Ignore
    }
    throw new Error(message)
  }
}

export interface Division {
  id?: number
  SchoolClass: number | null
  class_name: string
  division: string
  capacity: number | null
}

export async function getDivisions(): Promise<Division[]> {
  const url = `${API_BASE_URL}${API_ENDPOINTS.DIVISION_SET}`
  const response = await fetchWithAuth(url)

  if (!response.ok) {
    let message = "Failed to fetch divisions."
    try {
      const err = await response.json()
      message = err?.detail || err?.message || message
    } catch {
      // Ignore
    }
    throw new Error(message)
  }

  const data = await response.json()
  return Array.isArray(data) ? data : (data.data ?? data.results ?? [])
}

export async function saveDivision(payload: Division): Promise<void> {
  const url = `${API_BASE_URL}${API_ENDPOINTS.DIVISION_SET}`
  const response = await fetchWithAuth(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    let message = "Failed to save division."
    try {
      const err = await response.json()
      message = err?.detail || err?.message || message
    } catch {
      // Ignore
    }
    throw new Error(message)
  }
}

export async function deleteDivision(id: number): Promise<void> {
  const url = `${API_BASE_URL}${API_ENDPOINTS.DIVISION_SET}${id}/`
  const response = await fetchWithAuth(url, {
    method: "DELETE",
  })

  if (!response.ok) {
    let message = "Failed to delete division."
    try {
      const err = await response.json()
      message = err?.detail || err?.message || message
    } catch {
      // Ignore
    }
    throw new Error(message)
  }
}

export interface Subject {
  id?: number
  name: string
  division: number | null
}

export async function getSubjects(): Promise<Subject[]> {
  const url = `${API_BASE_URL}${API_ENDPOINTS.SET_SUBJECT}`
  const response = await fetchWithAuth(url)

  if (!response.ok) {
    let message = "Failed to fetch subjects."
    try {
      const err = await response.json()
      message = err?.detail || err?.message || message
    } catch {
      // Ignore
    }
    throw new Error(message)
  }

  const data = await response.json()
  return Array.isArray(data) ? data : (data.data ?? data.results ?? [])
}

export async function saveSubject(payload: Subject): Promise<void> {
  const url = `${API_BASE_URL}${API_ENDPOINTS.SET_SUBJECT}`
  const response = await fetchWithAuth(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    let message = "Failed to save subject."
    try {
      const err = await response.json()
      message = err?.detail || err?.message || message
    } catch {
      // Ignore
    }
    throw new Error(message)
  }
}

export async function deleteSubject(id: number): Promise<void> {
  const url = `${API_BASE_URL}${API_ENDPOINTS.SET_SUBJECT}${id}/`
  const response = await fetchWithAuth(url, {
    method: "DELETE",
  })

  if (!response.ok) {
    let message = "Failed to delete subject."
    try {
      const err = await response.json()
      message = err?.detail || err?.message || message
    } catch {
      // Ignore
    }
    throw new Error(message)
  }
}

export interface Syllabus {
  id?: number
  syllabus_file: string | File | null
  division: number | null
  subject: number | null
}

export async function getSyllabusList(): Promise<Syllabus[]> {
  const url = `${API_BASE_URL}${API_ENDPOINTS.SYLLABUS}`
  const response = await fetchWithAuth(url)

  if (!response.ok) {
    let message = "Failed to fetch syllabus."
    try {
      const err = await response.json()
      message = err?.detail || err?.message || message
    } catch {
      // Ignore
    }
    throw new Error(message)
  }

  const data = await response.json()
  return Array.isArray(data) ? data : (data.data ?? data.results ?? [])
}

export async function saveSyllabus(payload: Syllabus): Promise<void> {
  const url = `${API_BASE_URL}${API_ENDPOINTS.SYLLABUS}`
  
  const formData = new FormData()
  if (payload.syllabus_file instanceof File) {
    formData.append("syllabus_file", payload.syllabus_file)
  }
  if (payload.division) formData.append("division", payload.division.toString())
  if (payload.subject) formData.append("subject", payload.subject.toString())

  const response = await fetchWithAuth(url, {
    method: "POST",
    body: formData,
  })

  if (!response.ok) {
    let message = "Failed to save syllabus."
    try {
      const err = await response.json()
      message = err?.detail || err?.message || message
    } catch {
      // Ignore
    }
    throw new Error(message)
  }
}

export async function deleteSyllabus(id: number): Promise<void> {
  const url = `${API_BASE_URL}${API_ENDPOINTS.SYLLABUS}${id}/`
  const response = await fetchWithAuth(url, {
    method: "DELETE",
  })

  if (!response.ok) {
    let message = "Failed to delete syllabus."
    try {
      const err = await response.json()
      message = err?.detail || err?.message || message
    } catch {
      // Ignore
    }
    throw new Error(message)
  }
}

export interface Teacher {
  id: number
  name: string
}

export async function getTeachers(): Promise<Teacher[]> {
  const url = `${API_BASE_URL}${API_ENDPOINTS.GET_TEACHER}`
  const response = await fetchWithAuth(url)

  if (!response.ok) {
    let message = "Failed to fetch teachers."
    try {
      const err = await response.json()
      message = err?.detail || err?.message || message
    } catch {
      // Ignore
    }
    throw new Error(message)
  }

  const data = await response.json()
  return Array.isArray(data) ? data : (data.data ?? data.results ?? [])
}

export interface AssignClassPayload {
  is_class_teacher: boolean
  teacher: number
  subject: number
  division: number
}

export async function assignClass(payload: AssignClassPayload): Promise<void> {
  const url = `${API_BASE_URL}${API_ENDPOINTS.ASSIGN_CLASS}`
  const response = await fetchWithAuth(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    let message = "Failed to assign teacher."
    try {
      const err = await response.json()
      message = err?.detail || err?.message || message
    } catch {
      // Ignore
    }
    throw new Error(message)
  }
}
