import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import projectReducer from './slices/projectSlice';
import organizationReducer from './slices/organizationSlice';
import localReducer from './slices/localSlice';
import { setupListeners } from '@reduxjs/toolkit/query';
import { projectsApi } from '@/services/project.service';
import { organizationApi } from '@/services/organization.service';
import { localApi } from '@/services/local.service';

export const store = configureStore({
  reducer: {
    auth: authReducer,

    project:projectReducer,
    [projectsApi.reducerPath]: projectsApi.reducer,
    organization:organizationReducer,
    [organizationApi.reducerPath]: organizationApi.reducer,
    local:localReducer,
    [localApi.reducerPath]: localApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(projectsApi.middleware, organizationApi.middleware, localApi.middleware),
});
setupListeners(store.dispatch);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
