import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import stationReducer from './slices/stationSlice';
import locationReducer from './slices/locationSlice';
import { stationsApi } from '@/services/stations.service';
import { setupListeners } from '@reduxjs/toolkit/query';
import { locationsApi } from '@/services/location.service';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    station : stationReducer,
    [stationsApi.reducerPath]: stationsApi.reducer,
    location:locationReducer,
    [locationsApi.reducerPath]: locationsApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(stationsApi.middleware , locationsApi.middleware),
});
setupListeners(store.dispatch);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
