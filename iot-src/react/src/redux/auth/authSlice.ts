import AuthService from "../../api/auth/AuthService";
import { ILoginResponse, IProfile } from "../../api/auth/models";
import { createSlice, PayloadAction, Slice } from "@reduxjs/toolkit";

// Interfaces
export interface IAuthState {
  token?: string;
  profile?: IProfile;
  expiration?: string;
}
//

const initialState: IAuthState = {
  token: AuthService.getToken(),
  profile: AuthService.getUserProfile(),
  expiration: AuthService.getTokenExpiration(),
};

//Slice
const authSlice: Slice<IAuthState> = createSlice({
  name: "auth",
  initialState: initialState,
  reducers: {
    loginSuccessful: (state, action: PayloadAction<ILoginResponse>) => {
      const { token, profile, expiration } = action.payload;
      state = { ...state, token, profile, expiration };
      return state;
    },
    logout: (state) => {
      return {
        ...state,
        expiration: undefined,
        profile: undefined,
        token: undefined,
      };
    },
    refreshToken: (state, action: PayloadAction<ILoginResponse>) => {
      const { token, expiration } = action.payload;
      return {
        ...state,
        token: token,
        expiration: expiration,
      };
    },
  },
});

export const { loginSuccessful, logout, refreshToken } = authSlice.actions;

export default authSlice.reducer;
