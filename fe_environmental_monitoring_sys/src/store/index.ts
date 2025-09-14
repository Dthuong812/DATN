import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import projectReducer from './slices/projectSlice';
import organizationReducer from './slices/organizationSlice';
import localReducer from './slices/localSlice';
import departmentReducer from './slices/departmentSlice';
import { setupListeners } from '@reduxjs/toolkit/query';
import { projectsApi } from '@/services/project.service';
import { organizationApi } from '@/services/organization.service';
import { localApi } from '@/services/local.service';
import { departmentApi } from '@/services/department.service';

export const store = configureStore({
  reducer: {
    auth: authReducer,

    project:projectReducer,
    [projectsApi.reducerPath]: projectsApi.reducer,
    organization:organizationReducer,
    [organizationApi.reducerPath]: organizationApi.reducer,
    local:localReducer,
    [localApi.reducerPath]: localApi.reducer,
    department:departmentReducer,
    [departmentApi.reducerPath]: departmentApi.reducer, 
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(projectsApi.middleware, organizationApi.middleware, localApi.middleware, departmentApi.middleware),
});
setupListeners(store.dispatch);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
