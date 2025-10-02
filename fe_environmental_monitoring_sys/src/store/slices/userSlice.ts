import type { AsyncState, UserResponse} from "@/types/types";
import { createSlice } from "@reduxjs/toolkit";

interface UserState extends AsyncState {
  users: UserResponse  | null;
}

// Example usage of UserState
const initialState: UserState = {
  users: null,
  isLoading: false,
  isSuccess: false,
  isError: false,
  error: null,
};

const userSlice = createSlice({
  name: "user",
    initialState,
    reducers: {
    }
}); 
export const { actions, reducer } = userSlice;
export default userSlice.reducer;