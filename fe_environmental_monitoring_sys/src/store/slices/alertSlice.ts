import type { AsyncState, DeviceDataResponse} from "@/types/types";
import { createSlice } from "@reduxjs/toolkit";

interface AlertState extends AsyncState {
  deviceDatas: DeviceDataResponse  | null;
}

const initialState: AlertState = {
  deviceDatas: null,
  isLoading: false,
  isSuccess: false,
  isError: false,
  error: null,
};

const alertSlice = createSlice({
  name: "deviceData",
    initialState,
    reducers: {
    }
}); 
export const { actions, reducer } = alertSlice;
export default alertSlice.reducer;