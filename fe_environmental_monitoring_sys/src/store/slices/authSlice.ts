import type { JWT, LoginPayload, LoginResponse } from "@/types/types";
import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import authService from "../APIs/auth.service";

interface AsyncState {
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  error?: string | null;
}

interface AuthState extends AsyncState {
  user?: LoginResponse | null;
  token?: JWT | null;
  isAuthenticated?: boolean;
}

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  isSuccess: false,
  isError: false,
  error: null,
};

export const loginUser = createAsyncThunk<
  LoginResponse,
  LoginPayload,
  { rejectValue: string }
>("auth/signin", async (payload, { rejectWithValue }) => {
  try {
    const result = await authService.login(payload);
    return result;
    console.log("Login response1:", result);
  } catch {
    return rejectWithValue("Đăng nhập thất bại!");
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.isError = false;
      state.isSuccess = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.isError = false;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<LoginResponse>) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload;
        state.token = { token: action.payload.Data.access_token };
        state.isAuthenticated = true;
        localStorage.setItem("token", action.payload.Data.access_token);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.error = action.payload || "Đăng nhập thất bại!";
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
