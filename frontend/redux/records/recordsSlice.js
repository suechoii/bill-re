import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import * as SecureStore from "expo-secure-store";

const initialState = {
  selectedFriends: [],
};

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export const createRecord = createAsyncThunk(
  "records/createRecords",
  async (recordData, thunkAPI) => {
    try {
      const email = await SecureStore.getItemAsync("email");
      console.log("Received record data: ", recordData);
      const response = await axios.post(
        `${API_URL}/record/create-borrow-record/${email}`,
        { friend_and_amount: recordData }
      );
      console.log(response.data);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.detail);
    }
  }
);

export const recordsSlice = createSlice({
  name: "records",
  initialState,
  reducers: {
    setSelectedFriends: (state, action) => {
      state.selectedFriends = action.payload.sort();
    },
  },
});

export const { setSelectedFriends } = recordsSlice.actions;

export default recordsSlice.reducer;
