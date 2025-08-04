import type { AsyncState, LocationsResponse } from "@/types/types";
import { createSlice } from "@reduxjs/toolkit";

interface LocationState extends AsyncState {
  locations:LocationsResponse | null;
}

const initialState: LocationState = {
  locations: null,
  isLoading: false,
  isSuccess: false,
  isError: false,
  error: null,
};

const locationSlice = createSlice({
  name: "location",
    initialState,
    reducers: {
    }
}); 
export const { actions, reducer } = locationSlice;
export default locationSlice.reducer;