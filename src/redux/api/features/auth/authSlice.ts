import { createSlice } from "@reduxjs/toolkit";
import type { RootState } from "../../../store";
import type { TJwtPayload } from "../../../../type";



type TAuthState = {
  user: null | TJwtPayload;
  token: null | string;
};

const initialState: TAuthState = {
  user: null,
  token: null,
};
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {
      const { user, token } = action.payload;
      state.user = user;
      state.token = token;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
    },
  },
});

export const { setUser, logout } = authSlice.actions;

export default authSlice.reducer;

export const getToken = (state:RootState) => state.auth.token;
export const getUser = (state:RootState) => state.auth.user;