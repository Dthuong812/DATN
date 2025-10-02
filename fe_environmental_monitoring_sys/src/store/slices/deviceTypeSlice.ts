import type { AsyncState, DeviceTypeResponse,} from "@/types/types";
import { createSlice } from "@reduxjs/toolkit";

interface DeviceTypeState extends AsyncState {
  deviceTypes: DeviceTypeResponse  | null;
}

// Example usage of deviceTypeState
const initialState: DeviceTypeState = {
  deviceTypes: null,
  isLoading: false,
  isSuccess: false,
  isError: false,
  error: null,
};

const deviceTypeSlice = createSlice({
  name: "deviceType",
    initialState,
    reducers: {
    }
}); 
export const { actions, reducer } = deviceTypeSlice;
export default deviceTypeSlice.reducer;