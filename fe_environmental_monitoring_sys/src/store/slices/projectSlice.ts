import type { AsyncState, ProjectResponse  } from "@/types/types";
import { createSlice } from "@reduxjs/toolkit";

interface ProjectState extends AsyncState {
  projects: ProjectResponse  | null;
}

// Example usage of ProjectState
const initialState: ProjectState = {
  projects: null,
  isLoading: false,
  isSuccess: false,
  isError: false,
  error: null,
};

const projectSlice = createSlice({
  name: "project",
    initialState,
    reducers: {
    }
}); 
export const { actions, reducer } = projectSlice;
export default projectSlice.reducer;