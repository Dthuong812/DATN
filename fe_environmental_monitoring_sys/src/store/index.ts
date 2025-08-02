import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import stationReducer from './slices/stationSlice';
import { stationsApi } from '@/services/stations.service';
import { setupListeners } from '@reduxjs/toolkit/query';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    station : stationReducer,
    [stationsApi.reducerPath]: stationsApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(stationsApi.middleware),
});
setupListeners(store.dispatch);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
