import { configureStore } from "@reduxjs/toolkit";
import { baseApi } from "./api/baseApi";
import authReducer from "./api/features/auth/authSlice";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
// import storage from "redux-persist/lib/storage";
import storageModule from "redux-persist/lib/storage";
import { rtkQueryErrorLogger } from "../middleware/rtkQueryErrorLogger";

const storage = (storageModule as any).default ?? storageModule;

// rtk query: https://redux-toolkit.js.org/rtk-query/overview
// redux persist: https://www.npmjs.com/package/redux-persist

const persistConfig = {
  key: "auth",
  storage,
};

const persistedReducer = persistReducer(persistConfig, authReducer);

export const store = configureStore({
  reducer: {
    // Add the generated reducer as a specific top-level slice
    [baseApi.reducerPath]: baseApi.reducer,
    auth: persistedReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      // https://redux-toolkit.js.org/usage/usage-guide#use-with-redux-persist
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER], // to solve non serialize error
      },
    }).concat(baseApi.middleware, rtkQueryErrorLogger),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

export const persistor = persistStore(store);
