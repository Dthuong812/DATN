import type { AsyncState, LogResponse} from "@/types/types";
import { createSlice } from "@reduxjs/toolkit";

interface LogState extends AsyncState {
  logs: LogResponse  | null;
}

// Example usage of LogState
const initialState: LogState = {
  logs: null,
  isLoading: false,
  isSuccess: false,
  isError: false,
  error: null,
};

const logSlice = createSlice({
  name: "Log",
    initialState,
    reducers: {
    }
}); 
export const { actions, reducer } = logSlice;
export default logSlice.reducer;