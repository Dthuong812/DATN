import type { ForgotPayload, ForgotResponse, LoginPayload, LoginResponse } from "@/types/types";
import { createAsyncThunk } from "@reduxjs/toolkit";
import authService from "../Services/auth.service";

export const loginUser = createAsyncThunk<
  LoginResponse,
  LoginPayload,
  { rejectValue: string }
>("auth/signin", async (payload, { rejectWithValue }) => {
  try {
    const result = await authService.login(payload);
    return result;
  } catch {
    return rejectWithValue("Đăng nhập thất bại!");
  }
});

export const forgotPassword = createAsyncThunk<
  ForgotResponse,
  ForgotPayload,
  { rejectValue: string }
>("auth/forgot-password", async (payload, { rejectWithValue }) => {
  try{
    const result = await authService.forgot_password(payload);
    return result;
  }
  catch{
    return rejectWithValue("Khôi phục mật khẩu thất bại!");
  }
}
);