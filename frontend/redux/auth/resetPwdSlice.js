import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  email: "",
  code: "",
  password: "",
};

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export const sendVerificationCode = createAsyncThunk(
  "resetPwd/sendVerificationCode",
  async (userEmail, thunkAPI) => {
    try {
      const response = await axios.post(
        `${API_URL}/auth/reset-password/email/${userEmail}`
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.detail);
    }
  }
);

export const verifyVerificationCode = createAsyncThunk(
  "resetPwd/sendVerificationCode",
  async (userVerifyData, thunkAPI) => {
    try {
      const response = await axios.post(
        `${API_URL}/auth/reset-password/check-code`,
        userVerifyData
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.detail);
    }
  }
);

export const resetPassword = createAsyncThunk(
  "resetPwd/resetPassword",
  async (userResetData, thunkAPI) => {
    try {
      const response = await axios.patch(
        `${API_URL}/auth/reset-password/${userResetData.email}`,
        { new_password: userResetData.new_password }
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.detail);
    }
  }
);

export const resetPwdSlice = createSlice({
  name: "resetPwd",
  initialState,
  reducers: {
    setEmail: (state, action) => {
      state.email = action.payload;
    },
    setCode: (state, action) => {
      state.code = action.payload;
    },
    setPassword: (state, action) => {
      state.password = action.payload;
    },
  },
});

export const { setEmail, setCode, setPassword } = resetPwdSlice.actions;

export default resetPwdSlice.reducer;
