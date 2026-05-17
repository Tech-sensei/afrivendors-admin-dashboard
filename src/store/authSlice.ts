import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit"
import http, { redirectToSignIn } from "@/lib/http"
import type { AdminProfile, AuthState } from "@/types/auth"

const initialState: AuthState = {
  profile: null,
  isAuthenticated: false,
  isLoadingUser: false,
}

export const fetchUserProfile = createAsyncThunk(
  "auth/fetchUserProfile",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await http.get("/admin/me")
      return (data?.data ?? data) as AdminProfile
    } catch (error: any) {
      const status = error.response?.status
      if (status === 401) {
        return rejectWithValue({ is401: true })
      }
      if (status === 403) {
        redirectToSignIn()
        return rejectWithValue({ isForbiddenPortal: true })
      }
      return rejectWithValue(error.response?.data?.message || "Failed to fetch profile")
    }
  },
)

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setProfile: (state, action: PayloadAction<AdminProfile>) => {
      state.profile = action.payload
      state.isAuthenticated = true
    },
    clearAuth: (state) => {
      state.profile = null
      state.isAuthenticated = false
      state.isLoadingUser = false
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserProfile.pending, (state) => {
        state.isLoadingUser = true
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.profile = action.payload
        state.isAuthenticated = true
        state.isLoadingUser = false
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.isLoadingUser = false
        if (
          (action.payload as any)?.is401 ||
          (action.payload as any)?.isForbiddenPortal
        ) {
          state.profile = null
          state.isAuthenticated = false
        }
      })
  },
})

export const { setProfile, clearAuth } = authSlice.actions
export default authSlice.reducer
