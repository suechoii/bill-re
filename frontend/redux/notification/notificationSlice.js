import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import * as SecureStore from "expo-secure-store";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

/**
 * Notification에 띄울 알림 리스트를 서버에서 불러오는 함수
 */
export const getNotificationList = createAsyncThunk(
  "notification/",
  async (thunkAPI) => {
    try {
      const username = await SecureStore.getItemAsync("userName");

      const response = await axios.get(`${API_URL}/notification`, {
        username: username,
      });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.detail);
    }
  }
);
