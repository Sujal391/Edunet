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
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
}

export interface CreateSchoolResponse {
  meassage: string; // intentional typo from backend
}