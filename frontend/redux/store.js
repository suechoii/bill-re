import { configureStore } from "@reduxjs/toolkit";
import signInReducer from "./auth/signInSlice";
import signUpReducer from "./auth/signUpSlice";
import resetPwdReducer from "./auth/resetPwdSlice";
import friendsReducer from "./friends/friendsSlice";
import recordsReducer from "./records/recordsSlice";

export const store = configureStore({
  reducer: {
    signIn: signInReducer,
    signUp: signUpReducer,
    resetPwd: resetPwdReducer,
    friends: friendsReducer,
    records: recordsReducer,
  },
});
