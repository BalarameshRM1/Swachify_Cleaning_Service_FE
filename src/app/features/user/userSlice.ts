import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { User, UserState } from "./userTypes";
import { baseUrl } from "../../../utils/constants/config";

export const fetchUserById = createAsyncThunk<User, number>(
  "user/fetchUserById",
  async (userId) => {
    const response = await fetch(`${baseUrl}/users/${userId}`);
    if (!response.ok) throw new Error("Failed to fetch user data");
    const data = await response.json();
    return data as User;
  }
);

const initialState: UserState = {
  user: null,
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    clearUser: (state) => {
      state.user = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserById.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(fetchUserById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Something went wrong";
      });
  },
});

export const { clearUser } = userSlice.actions;
export default userSlice.reducer;
