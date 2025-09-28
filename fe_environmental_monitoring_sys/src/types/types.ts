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

export interface ChangePasswordPayload {
  Id:number
  OldPassWord: string,
  PassWord: string,
  PassWordAgain: string
}
export interface Project {
  Id: number;
  Code: string;
  Name: string;
  Description: string;
  Functions: Function[];
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
  Functions: Function[];
}


export interface Organization {
  Id: number;
  Local_Id:number
  Parent_Id:number | null;
  Code: string;
  Name: string;
  Phone: string;
  Email: string;
  ParentName: string | null;
  LocalName: string | null;
  Project?: Project[];
}
export interface OrganizationResponse {
  Status: number;
  Message: string;
  Data: {
    Organization: Organization[];
  };
}
export interface OrganizationFormValue {
  Local_Id:number
  Parent_Id:number | null;
  Code: string;
  Name: string;
  Phone: string;
  Email: string;
  Project: Project[];
}
export interface Local {
  Id: number;
  Name: string;
} 
export interface LocalResponse{
  Status: number;
  Message: string;
  Data: {
    Local: Local[];
  };
}

export interface Department {
  Id: number;
  Organization_Id:number
  Parent_Id:number | null;
  Code: string;
  Name: string;
  Phone: string;
  Email: string;
  ParentName: string | null;
}
export interface DepartmentResponse {
  Status: number;
  Message: string;
  Data: {
    Department: Department[];
  };
}
export interface DepartmentFormValue {
  Organization_Id:number
  Parent_Id:number | null;
  Code: string;
  Name: string;
  Phone: string;
  Email: string;
}

export interface Function {
  Id: number;
  Name: string;
  Code: string;
  Description: string;
  CreatedAt: Date;
}
export interface FunctionResponse {
  Status: number;
  Message: string;
  Data: {
    Function: Function[];
  };
}

export interface Permission{
  Id: number;
  Code : string;
  Name : string;
}
export interface PermissionResponse {
  Status: number;
  Message: string;
  Data: {
    Permission: Permission[];
  };
}
export interface FuncPers {
  Id: number;
  Code: string;
  Name: string;
  Permissions: Permission[];
}
export interface Role {
  Id: number;
  Code: string;
  Name: string;
  Description: string;
  CreatedAt: Date;
  TotalUser: number;

}
export interface RoleResponse {
  Status: number;
  Message: string;
  Data: {
    Role: Role[];
  };
}

export interface RoleFormValue {
  Code: string;
  Name: string;
  Description: string;
  Projects: number[];
  Functions: number[];
  Permissions: number[];
}

export interface User {
  Id: number;
  UserName: string;
  FullName: string;
  Email: string;
  Phone: string;
  Organization_Id: number;
  OrganizationName: string | null;
  Department_Id: number | null;
  DepartmentName: string | null;
  Active: number;
  Roles: Role[];
}
export interface UserResponse {
  Status: number;
  Message: string;
  Data: {
    User: User[];
  };
}
export interface UserFormValue {
  UserName: string;
  PassWord: string;
  FullName: string;
  Email: string;
  Phone: string;
  Organization_Id: number;
  Department_Id: number | null;
  Active: number;
  Roles: number[];
}

export interface Log{
  Id: number;
  LogTypeId: number;
  Service : string
  Action: string;
  Method: string;
  Content: string;
  Data: string;
  CreatedAt: Date;
  CreatedBy: number;
  LogTypeName: string;
}
export interface LogResponse {
  Status: number;
  Message: string;
  Data: Log[];
}

export interface Details_Value {
  Address: string;
  Installation_Date: Date;
  Last_Maintenance_Date: Date;
  Power_Supply: string;
  Connection_Type: string;
  Note : string;  
}
export interface Object{
  Id: number;
  Code: string;
  Name: string;
  Project_Code: string;
  Organization_Code: string;
  Status: number;
  Latitude: number;
  Longitude: number;
  CreatedAt: Date;
  CreatedBy: number;
  UpdatedAt: Date;
  UpdatedBy: number;
  Details_Value: Details_Value
}
export interface ObjectResponse {
  Status: number;
  Message: string;
  Data: Object[];
}
export interface ObjectFormValue {
  Code: string;
  Name: string;
  Project_Code: string;
  Organization_Code: string;
  Status: number;
  Latitude: number;
  Longitude: number;
  Details_Value: Details_Value
}

export interface SensorUnits {
  temperature?: string; 
  humidity?: string;
  pressure?: string;
  gas?: string;
  distance?: string;
  sound_level?: string;
  [key: string]: string | undefined; 
}
export interface Sensor {
  code: string;
  name: string;
  unit: SensorUnits;
}
export interface Details_Data {
  sensors: Sensor[];
}
export interface Device{
  Id: number;
  Code: string;
  Name: string;
  DeviceType_Code: string;
  Object_Code: string;
  Latitude: number;
  Longitude: number;
  CreatedAt: Date;
  CreatedBy: number;
  UpdatedAt: Date;
  UpdatedBy: number;
  Icon_Id: number;
  Series: string;
  Details_Data: Details_Data
}
export interface DeviceResponse {
  Status: number;
  Message: string;
  Data: Device[];
}
export interface DeviceFormValue {
  Code: string;
  Name: string;
  DeviceType_Code: string;
  Object_Code: string;
  Latitude?: number;
  Longitude?: number;
  Icon_Id?: number;
  Series: string;
  Details_Data: Details_Data
}
export interface DeviceType{
  Id: number;
  Code: string;
  Name: string;
}
export interface DeviceTypeResponse {
  Status: number;
  Message: string;
  Data: DeviceType[];
}
export interface DeviceTypeFormValue {
  Code: string;
  Name: string;
}
export interface DataJson {
  temperature?: number; 
  humidity?: number;
  pressure?: number;
  gas?: number;
  distance?: number;
  sound_level?: number;
  [key: string]: number | undefined; 
}
export interface DeviceData {
  Id: number;
  Devices_Code: string;
  Project_Code: string;
  Object_Code: string;
  Times: Date;
  Longitude: number;
  Latitude: number;
  Speed: number;
  DataType: number;
  DataJson: DataJson;
}

export interface DeviceDataResponse {
  Status: number;
  Message: string;
  Data: DeviceData[];
}
