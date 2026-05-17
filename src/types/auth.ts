export interface AdminAccount {
  id: number
  firstName: string
  lastName: string
  email: string
  country?: string
  phoneNumber?: string
  accountType: string
  adminRoles: string[] | string | null
  createdAt: string
  updatedAt?: string
}

export interface AdminProfile {
  admin: AdminAccount
}

export interface AuthState {
  profile: AdminProfile | null
  isAuthenticated: boolean
  isLoadingUser: boolean
}

export interface SignInPayload {
  email: string
  password: string
  /** Injected by `useAuthAPI` — do not omit when calling mutate. */
  portal?: string
}

export interface AdminLoginResponse {
  id: number
  accountType: string
  adminRoles: string[] | string | null
  firstName: string
  lastName: string
  email?: string
  phoneNumber?: string
  createdAt: string
  accessToken?: string
  refreshToken?: string
}

/** `POST /auth/refresh` success body (Authorization = refresh JWT). */
export interface AdminAuthRefreshResponse {
  id?: number
  accessToken: string
  refreshToken?: string
}
