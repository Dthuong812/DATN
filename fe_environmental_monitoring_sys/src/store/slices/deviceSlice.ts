import type { AsyncState, DeviceResponse,} from "@/types/types";
import { createSlice } from "@reduxjs/toolkit";

interface DeviceState extends AsyncState {
  devices: DeviceResponse  | null;
}

// Example usage of deviceState
const initialState: DeviceState = {
  devices: null,
  isLoading: false,
  isSuccess: false,
  isError: false,
  error: null,
};

const deviceSlice = createSlice({
  name: "device",
    initialState,
    reducers: {
    }
}); 
export const { actions, reducer } = deviceSlice;
export default deviceSlice.reducer;