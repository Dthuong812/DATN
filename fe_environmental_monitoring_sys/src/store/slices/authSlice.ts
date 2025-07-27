import {type JWT, type LoginResponse, } from "@/types/types";
import {  createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { forgotPassword, loginUser } from "../middleware/auth.middleware";


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
  forgotSuccess?: boolean;
}

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  isSuccess: false,
  isError: false,
  error: null,
  forgotSuccess: false,
};

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
        localStorage.setItem("user", JSON.stringify(action.payload.Data.UserName));
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.error = action.payload || "Đăng nhập thất bại!";
      })
      .addCase(forgotPassword.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.forgotSuccess = false;
        state.error = null;
      })
      .addCase(forgotPassword.fulfilled, (state) => {
        state.isLoading = false;
        state.forgotSuccess = true;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.forgotSuccess = false;
        state.error = action.payload || "Khôi phục mật khẩu thất bại!";
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
