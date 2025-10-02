import type { AsyncState, LocalResponse} from "@/types/types";
import { createSlice } from "@reduxjs/toolkit";

interface LocalState extends AsyncState {
  locals: LocalResponse  | null;
}

// Example usage of LocalState
const initialState: LocalState = {
  locals: null,
  isLoading: false,
  isSuccess: false,
  isError: false,
  error: null,
};

const localSlice = createSlice({
  name: "Local",
    initialState,
    reducers: {
    }
}); 
export const { actions, reducer } = localSlice;
export default localSlice.reducer;