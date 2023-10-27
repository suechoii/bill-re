import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import * as SecureStore from "expo-secure-store";

const initialState = {
  friends: [],
  loading: false,
  error: null,
};

const API_URL = process.env.EXPO_PUBLIC_API_URL;

const token = await SecureStore.getItemAsync("token");

export const getAllFriends = createAsyncThunk(
  "friends/getAllFriends",
  async (thunkAPI) => {
    try {
      const response = await axios.get(`${API_URL}/user`, { headers: token });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.detail);
    }
  }
);

export const friendsSlice = createSlice({
  name: "friends",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllFriends.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllFriends.fulfilled, (state, action) => {
        state.friends = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(getAllFriends.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const {} = friendsSlice.actions;

export default friendsSlice.reducer;
