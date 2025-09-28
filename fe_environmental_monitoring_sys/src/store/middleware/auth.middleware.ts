import type { ForgotPayload, ForgotResponse, LoginPayload, LoginResponse } from "@/types/types";
import { createAsyncThunk } from "@reduxjs/toolkit";
import authService from "../../services/auth.service";

export const loginUser = createAsyncThunk<
  LoginResponse,       
  LoginPayload,        
  { rejectValue: string } 
>(
  "auth/loginUser",
  async (payload, { rejectWithValue }) => {
    try {
      const res = await authService.login(payload); 
      if (res.Status !== 0) {

        return rejectWithValue(res.Message);
      }
      return res;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.Message || err.message);
    }
  }
);

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
    return rejectWithValue("Email không hợp lệ!");
  }
}
);