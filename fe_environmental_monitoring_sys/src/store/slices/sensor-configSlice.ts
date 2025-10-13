import type { AsyncState, ConfigResponse  } from "@/types/types";
import { createSlice } from "@reduxjs/toolkit";

interface ConfigState extends AsyncState {
  configs: ConfigResponse  | null;
}

// Example usage of configState
const initialState: ConfigState = {
  configs: null,
  isLoading: false,
  isSuccess: false,
  isError: false,
  error: null,
};

const configSlice = createSlice({
  name: "config",
    initialState,
    reducers: {
    }
}); 
export const { actions, reducer } = configSlice;
export default configSlice.reducer;