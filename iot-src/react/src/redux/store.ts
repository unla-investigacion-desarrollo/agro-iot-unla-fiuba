import { configureStore, Store } from "@reduxjs/toolkit";
import { IS_DEVELOPMENT } from "../config/general-config";
import authReducer, { IAuthState } from "../redux/auth/authSlice";

export type IGlobalState = {
  auth: IAuthState;
};

const store: Store<IGlobalState> = configureStore({
  reducer: {
    auth: authReducer,
  },
  devTools: IS_DEVELOPMENT, //Disable Redux DevTools if false
});

export default store;
