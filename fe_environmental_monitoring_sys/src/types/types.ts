export interface Station {
  name: string;
  location: string;
  status: "Hoạt động" | "Bảo trì";
  aqi: number;
}
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

export interface LoginPayload {
  Email: string;
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
