import type { AsyncState, RoleResponse} from "@/types/types";
import { createSlice } from "@reduxjs/toolkit";

interface RoleState extends AsyncState {
  roles: RoleResponse  | null;
}

// Example usage of roleState
const initialState: RoleState = {
  roles: null,
  isLoading: false,
  isSuccess: false,
  isError: false,
  error: null,
};

const roleSlice = createSlice({
  name: "role",
    initialState,
    reducers: {
    }
}); 
export const { actions, reducer } = roleSlice;
export default roleSlice.reducer;