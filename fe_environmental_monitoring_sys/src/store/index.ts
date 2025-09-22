import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import projectReducer from "./slices/projectSlice";
import organizationReducer from "./slices/organizationSlice";
import localReducer from "./slices/localSlice";
import departmentReducer from "./slices/departmentSlice";
import functionReducer from "./slices/functionSlice";
import permissionReducer from "./slices/PermissionSlice";
import roleReducer from "./slices/roleSlice";
import useReducer from "./slices/userSlice";
import LogReducer from "./slices/logSlice";
import { setupListeners } from "@reduxjs/toolkit/query";
import { projectsApi } from "@/services/project.service";
import { organizationApi } from "@/services/organization.service";
import { localApi } from "@/services/local.service";
import { departmentApi } from "@/services/department.service";
import { functionApi } from "@/services/function.service";
import { permissionApi } from "@/services/permission.service";
import { roleApi } from "@/services/role.service";
import { usersApi } from "@/services/user.service";
import { LogsApi } from "@/services/log.service";

export const store = configureStore({
  reducer: {
    auth: authReducer,

    project: projectReducer,
    [projectsApi.reducerPath]: projectsApi.reducer,
    organization: organizationReducer,
    [organizationApi.reducerPath]: organizationApi.reducer,
    local: localReducer,
    [localApi.reducerPath]: localApi.reducer,
    department: departmentReducer,
    [departmentApi.reducerPath]: departmentApi.reducer,
    function: functionReducer,
    [functionApi.reducerPath]: functionApi.reducer,
    permission: permissionReducer,
    [permissionApi.reducerPath]: permissionApi.reducer,
    role: roleReducer,
    [roleApi.reducerPath]: roleApi.reducer,
    users: useReducer,
    [usersApi.reducerPath]: usersApi.reducer,
    log:LogReducer,
    [LogsApi.reducerPath]: LogsApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      projectsApi.middleware,
      organizationApi.middleware,
      localApi.middleware,
      departmentApi.middleware,
      functionApi.middleware,
      permissionApi.middleware,
      roleApi.middleware,
      usersApi.middleware,
      LogsApi.middleware
    ),
});
setupListeners(store.dispatch);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
