import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  username: "",
  password: "",
};

export const signInSlice = createSlice({
  name: "signIn",
  initialState,
  reducers: {
    setUsername: (state, action) => {
      state.username = action.payload;
    },
    setPassword: (state, action) => {
      state.password = action.payload;
    },
  },
});


export const { setUsername, setPassword } = signInSlice.actions;

export default signInSlice.reducer;
