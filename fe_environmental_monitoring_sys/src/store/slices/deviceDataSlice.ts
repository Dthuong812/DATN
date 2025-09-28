import type { AsyncState, DeviceDataResponse} from "@/types/types";
import { createSlice } from "@reduxjs/toolkit";

interface DeviceDataState extends AsyncState {
  deviceDatas: DeviceDataResponse  | null;
}

// Example usage of deviceDataState
const initialState: DeviceDataState = {
  deviceDatas: null,
  isLoading: false,
  isSuccess: false,
  isError: false,
  error: null,
};

const deviceDataSlice = createSlice({
  name: "deviceData",
    initialState,
    reducers: {
    }
}); 
export const { actions, reducer } = deviceDataSlice;
export default deviceDataSlice.reducer;