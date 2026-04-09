export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  access?: string;   // present if backend returns token in body
  refresh?: string;  // present if backend returns token in body
  roles: string[];
}

export interface School {
  id?: number;
  name: string | null;
  code?: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  pincode: string | null;
  is_active?: boolean | null;
  created_at?: string | null;
  updated_at?: string | null;
  login_id?: number | null;
}

export interface CreateSchoolPayload {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
  is_active?: boolean;
}

export interface CreateSchoolResponse {
  id?: number;
  code?: string | null;
  name?: string | null;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  country?: string | null;
  pincode?: string | null;
  is_active?: boolean | null;
  created_at?: string | null;
  updated_at?: string | null;
  login_id?: number | null;
  meassage?: string;
  message?: string;
}

export type StaffCategory =
  | "teaching"
  | "non_teaching"
  | "admin"
  | "support"
  | "account"
  | "library"
  | "other";

export interface Staff {
  id: number;
  name: string | null;
  email: string | null;
  phone_number: string | null;
  category: StaffCategory;
  address: string | null;
  date_of_birth: string | null;
  joining_date: string | null;
  salary: string | null;
  is_active: boolean;
  created_at: string | null;
  updated_at: string | null;
  user: number | null;
}

export interface CreateStaffPayload {
  name: string;
  email: string;
  phone_number: string;
  category: StaffCategory;
  address: string;
  date_of_birth: string;
  salary: string;
  is_active: boolean;
}
