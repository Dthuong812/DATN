import type { AsyncState, FunctionResponse} from "@/types/types";
import { createSlice } from "@reduxjs/toolkit";

interface FunctionState extends AsyncState {
  functions: FunctionResponse  | null;
}

// Example usage of FunctionState
const initialState: FunctionState = {
  functions: null,
  isLoading: false,
  isSuccess: false,
  isError: false,
  error: null,
};

const functionSlice = createSlice({
  name: "function",
    initialState,
    reducers: {
    }
}); 
export const { actions, reducer } = functionSlice;
export default functionSlice.reducer;