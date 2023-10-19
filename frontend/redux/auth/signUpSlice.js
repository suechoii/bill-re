import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  email: "",
  username: "",
  password: "",
  payme_link: "",
  code: "",
};

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
});

export const { setEmail, setUsername, setPassword, setPayMeLink, setCode } =
  signUpSlice.actions;

export default signUpSlice.reducer;
