import type { AsyncState, DepartmentResponse,} from "@/types/types";
import { createSlice } from "@reduxjs/toolkit";

interface DepartmentState extends AsyncState {
  departments: DepartmentResponse  | null;
}

// Example usage of DepartmentState
const initialState: DepartmentState = {
  departments: null,
  isLoading: false,
  isSuccess: false,
  isError: false,
  error: null,
};

const departmentSlice = createSlice({
  name: "Department",
    initialState,
    reducers: {
    }
}); 
export const { actions, reducer } = departmentSlice;
export default departmentSlice.reducer;