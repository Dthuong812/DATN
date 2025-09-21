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

