import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { AdminProfile, AuthState } from "@/types/auth"

const initialState: AuthState = {
  profile: null,
  isAuthenticated: false,
  isLoadingUser: false,
}

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setProfile: (state, action: PayloadAction<AdminProfile>) => {
      state.profile = action.payload
      state.isAuthenticated = true
      state.isLoadingUser = false
    },
    /** Mark session active when access/refresh cookies are valid (no profile fetch). */
    setSessionActive: (state) => {
      state.isAuthenticated = true
      state.isLoadingUser = false
    },
    setAuthLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoadingUser = action.payload
    },
    clearAuth: (state) => {
      state.profile = null
      state.isAuthenticated = false
      state.isLoadingUser = false
    },
  },
})

export const { setProfile, setSessionActive, setAuthLoading, clearAuth } = authSlice.actions
export default authSlice.reducer
