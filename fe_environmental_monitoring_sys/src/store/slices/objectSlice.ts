import type { AsyncState, ObjectResponse} from "@/types/types";
import { createSlice } from "@reduxjs/toolkit";

interface ObjectState extends AsyncState {
  objects: ObjectResponse  | null;
}

// Example usage of ObjectState
const initialState: ObjectState = {
  objects: null,
  isLoading: false,
  isSuccess: false,
  isError: false,
  error: null,
};

const objectSlice = createSlice({
  name: "Object",
    initialState,
    reducers: {
    }
}); 
export const { actions, reducer } = objectSlice;
export default objectSlice.reducer;