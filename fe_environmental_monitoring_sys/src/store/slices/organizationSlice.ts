import type { AsyncState, OrganizationResponse  } from "@/types/types";
import { createSlice } from "@reduxjs/toolkit";

interface OrganizationState extends AsyncState {
  organizations: OrganizationResponse  | null;
}

// Example usage of OrganizationState
const initialState: OrganizationState = {
  organizations: null,
  isLoading: false,
  isSuccess: false,
  isError: false,
  error: null,
};

const organizationSlice = createSlice({
  name: "Organization",
    initialState,
    reducers: {
    }
}); 
export const { actions, reducer } = organizationSlice;
export default organizationSlice.reducer;