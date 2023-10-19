import { configureStore } from "@reduxjs/toolkit";
import signInReducer from "./auth/signInSlice";
import signUpReducer from "./auth/signUpSlice";

export const store = configureStore({
  reducer: {
    signIn: signInReducer,
    signUp: signUpReducer,
  },
});
