import { configureStore } from "@reduxjs/toolkit";
import signInReducer from "./auth/signInSlice";
import signUpReducer from "./auth/signUpSlice";
import resetPwdReducer from "./auth/resetPwdSlice";

export const store = configureStore({
  reducer: {
    signIn: signInReducer,
    signUp: signUpReducer,
    resetPwd: resetPwdReducer,
  },
});
