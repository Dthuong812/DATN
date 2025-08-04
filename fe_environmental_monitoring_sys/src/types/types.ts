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

export interface ForgotPayload {
  Email: string;
}
export interface ForgotResponse {
  Status: number;
  Message: string;
}

export interface StationsResponse {
  Status: number;
  Message: string;
  Data: {
    Stations: Station[];
  };
}

export interface Station {
  Id: number;
  Name: string;
  Address: string;
  Lat: number;
  Lng: number;
  LocationId: string;
  Status: number;
  CreatedAt: Date;
  CreatedBy: string;
  UpdatedBy: string;
  UpdatedAt: Date;
}


export interface StationFormValues {
  Name: string;
  Address: string;
  LocationId: number;
  Lat: number;
  Lng: number;
  Status: number;
}

export interface Location {
  Id: number;
  Name: string;
  CreatedAt: Date;
}

export interface LocationsResponse {
  Status: number;
  Message: string;
  Data: {
    Locations: Location[];
  };
}