import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import * as SecureStore from "expo-secure-store";

const initialState = {
  friendUserName: "",
  friends: [],
  numberOfFriends: 0,
  loading: false,
  error: null,
};

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export const getAllFriends = createAsyncThunk(
  "friends/getAllFriends",
  async (thunkAPI) => {
    try {
      const token = await SecureStore.getItemAsync("token");
      const email = await SecureStore.getItemAsync("email");
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      const response = await axios.get(`${API_URL}/user/get-friends/${email}`);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.detail);
    }
  }
);

export const searchFriend = createAsyncThunk(
  "friends/searchFriend",
  async (friend_username, thunkAPI) => {
    try {
      const email = await SecureStore.getItemAsync("email");

      const response = await axios.get(`${API_URL}/user/search-friend`, {
        params: { email, friend_username },
      });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.detail);
    }
  }
);

export const addFriend = createAsyncThunk(
  "friends/addFriend",
  async (friendData, thunkAPI) => {
    try {
      const user_email = await SecureStore.getItemAsync("email");
      const friend_id = friendData.friend_id;
      const friend_username = friendData.friend_username;

      const response = await axios.post(`${API_URL}/user/add-friend`, {
        user_email,
        friend_id,
        friend_username,
      });

      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.detail);
    }
  }
);

export const friendsSlice = createSlice({
  name: "friends",
  initialState,
  reducers: {
    setFriendUserName: (state, action) => {
      state.friendUserName = action.payload;
    },
    addNewFriend: (state, action) => {
      state.friends.push(action.payload);
    },
  },
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
        state.numberOfFriends = action.payload.length;
      })
      .addCase(getAllFriends.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { setFriendUserName, addNewFriend } = friendsSlice.actions;

export default friendsSlice.reducer;
