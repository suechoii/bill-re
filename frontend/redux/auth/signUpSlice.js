import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  email: "",
  username: "",
  password: "",
  payme_link: "",
  code: "",
};

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export const registerAndSendCode = createAsyncThunk(
  "signUp/registerAndSendCode",
  async (userData, thunkAPI) => {
    try {
      const response = await axios.post(
        `${API_URL}/auth/register/verification`,
        userData
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.detail);
    }
  }
);

export const verifyCode = createAsyncThunk(
  "signUp/verifyCode",
  async (verificationData, thunkAPI) => {
    try {
      const response = await axios.post(
        `${API_URL}/auth/register/checkcode`,
        verificationData
      );
      console.log(response);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.detail);
    }
  }
);

export const signUpSlice = createSlice({
  name: "signUp",
  initialState,
  reducers: {
    setEmail: (state, action) => {
      state.email = action.payload;
    },
    setUsername: (state, action) => {
      state.username = action.payload;
    },
    setPassword: (state, action) => {
      state.password = action.payload;
    },
    setPayMeLink: (state, action) => {
      state.payme_link = action.payload;
    },
    setCode: (state, action) => {
      state.code = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(registerAndSendCode.fulfilled, (state, action) => {});
  },
});

export const { setEmail, setUsername, setPassword, setPayMeLink, setCode } =
  signUpSlice.actions;

export default signUpSlice.reducer;
