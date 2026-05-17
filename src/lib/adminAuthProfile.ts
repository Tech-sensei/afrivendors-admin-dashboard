import type { AdminLoginResponse, AdminProfile } from "@/types/auth"

/** Map `POST /auth/login` user fields into Redux profile shape (no `/admin/me`). */
export function adminLoginToProfile(data: AdminLoginResponse): AdminProfile {
  return {
    admin: {
      id: data.id,
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email ?? "",
      accountType: data.accountType,
      adminRoles: data.adminRoles,
      phoneNumber: data.phoneNumber,
      createdAt: data.createdAt,
    },
  }
}
