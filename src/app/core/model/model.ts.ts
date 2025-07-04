export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  status: string;
  message: string;
  data: LoginData;
  token: Token;
}

export interface Token {
  refresh: string;
  access: string;
}

export interface LoginData {
  id: number;
  last_uploaded_category?: any;
  role: string;
  permissions: string[];
  user_type: string;
  last_login: string;
  date_joined: string;
  last_modified: string;
  date_created: string;
  first_name: string;
  last_name: string;
  email: string;
  gender: string;
  phone?: any;
  is_active: boolean;
  is_verified: boolean;
  deleted_by?: any;
  last_upload_date?: any;
  last_upload_count: number;
  total_uploaded: number;
}

export interface BaseAPIResponse<T> {
  count: number;
  next?: any;
  previous?: any;
  results: T;
}

export interface CategoryResponse {
  id: number;
  columns: string[];
  user: string;
  archived?: any;
  last_modified: string;
  date_created: string;
  name: string;
  slug: string;
  is_active: boolean;
  last_upload_count: number;
  total_uploads: number;
}

export interface BaseCreateAPIResponse<T> {
  message: string;
  code: number;
  data: T;
  status: boolean;
}

export interface CategoryCreateRequest {
  id: number;
  columns: string[];
  user: string;
  archived?: any;
  last_modified: string;
  date_created: string;
  name: string;
  slug: string;
  is_active: boolean;
  last_upload_count: number;
  total_uploads: number;
}
