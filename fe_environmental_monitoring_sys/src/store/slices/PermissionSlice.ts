import type { AsyncState, PermissionResponse} from "@/types/types";
import { createSlice } from "@reduxjs/toolkit";

interface PermissionState extends AsyncState {
  permissions: PermissionResponse  | null;
}

// Example usage of PermissionState
const initialState: PermissionState = {
  permissions: null,
  isLoading: false,
  isSuccess: false,
  isError: false,
  error: null,
};

const permissionSlice = createSlice({
  name: "permission",
    initialState,
    reducers: {
    }
}); 
export const { actions, reducer } = permissionSlice;
export default permissionSlice.reducer;