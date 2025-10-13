import type { AsyncState, DeviceDataResponse} from "@/types/types";
import { createSlice } from "@reduxjs/toolkit";

interface BaoCaoState extends AsyncState {
  deviceDatas: DeviceDataResponse  | null;
}

// Example usage of deviceDataState
const initialState: BaoCaoState = {
  deviceDatas: null,
  isLoading: false,
  isSuccess: false,
  isError: false,
  error: null,
};

const baoCaoSlice = createSlice({
  name: "deviceData",
    initialState,
    reducers: {
    }
}); 
export const { actions, reducer } = baoCaoSlice;
export default baoCaoSlice.reducer;