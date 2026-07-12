import { createSlice } from "@reduxjs/toolkit";
import type { RootState } from "../../../store";
import type { TJwtPayload } from "../../../../type";
import { jwtDecode } from "jwt-decode";

type TAuthState = {
  user: null | TJwtPayload;
  accessToken: null | string;
};

const initialState: TAuthState = {
  user: null, // { id, name, email, role, avatar }
  accessToken: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { accessToken, user } = action.payload;
      state.accessToken = accessToken;

      if (user) {
        state.user = user;
      } else if (accessToken) {
        try {
          const decoded = jwtDecode<TJwtPayload>(accessToken);
          state.user = {
            userId: decoded.userId,
            name: decoded.name,
            email: decoded.email,
            role: decoded.role,
            iat: decoded.iat,
            exp: decoded.exp,
          };
        } catch {
          state.user = null;
        }
      }
    },
    updateUser: (state, action) => {
      state.user = { ...state.user, ...action.payload };
    },
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
    },
  },
});

export const { setCredentials, updateUser, logout } = authSlice.actions;
export default authSlice.reducer;

export const selectCurrentUser = (state: RootState) => state.auth.user;
export const selectCurrentToken = (state: RootState) => state.auth.accessToken;
export const selectIsAuthenticated = (state: RootState) =>
  Boolean(state.auth.accessToken);
export const selectUserRole = (state: RootState) => state.auth.user?.role;
