export interface PollutionStation {
  name: string;
  lat: number;
  lng: number;
  aqi: number;
}
export interface SensorData {
  id: string;
  name: string;
  lat: number;
  lng: number;
  aqi: number;
  temperature: number;
  humidity: number;
  timestamp: string;
  stationId: string;
}
export interface User {
  id: number;
  userName: string;
  fullName: string;
  email: string;
  phone: string;
  isDieuHanh: boolean;
  active: boolean;
}
///
export interface AsyncState {
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  error?: string | null;
}
export interface LoginPayload {
  UserName: string;
  PassWord: string;
}
export interface LoginResponse {
  Status: number;
  Message: string;
  Data: {
    UserId: number;
    UserName: string;
    Location_Id: number;
    IsManagement: number;
    access_token: string;
    refresh_token: string;
    exp_refresh: number;

  };
}
export interface JWT {
  token: string;
}

export interface ForgotPayload {
  Email: string;
}
export interface ForgotResponse {
  Status: number;
  Message: string;
}
export interface Project {
  Id: number;
  Code: string;
  Name: string;
  Description: string;
}

export interface ProjectResponse {
  Status: number;
  Message: string;
  Data: {
    Project: Project[];
  };
}
export interface ProjectFormValue {
  Code: string;
  Name: string;
  Description: string;
}