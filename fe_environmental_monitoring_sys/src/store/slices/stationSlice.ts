import type { AsyncState, StationsResponse } from "@/types/types";
import { createSlice } from "@reduxjs/toolkit";

interface StationState extends AsyncState {
  stations: StationsResponse | null;
}

// Example usage of StationState
const initialState: StationState = {
  stations: null,
  isLoading: false,
  isSuccess: false,
  isError: false,
  error: null,
};

const stationSlice = createSlice({
  name: "station",
    initialState,
    reducers: {
    }
}); 
export const { actions, reducer } = stationSlice;
export default stationSlice.reducer;