import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { RootState } from "../store";
import { logout, setCredentials } from "./features/auth/authSlice";
import type {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query";

// https://redux-toolkit.js.org/rtk-query/api/fetchBaseQuery#common-usage-patterns

// headers e accessToken add korar jonne baseQuery alada korchi
const baseQuery = fetchBaseQuery({
  baseUrl: "http://localhost:5000/api/v1",
  credentials: "include", // cokkie request er sathe patiye dibe
  prepareHeaders: (headers, { getState }) => {
    const accessToken = (getState() as RootState).auth.accessToken;

    // If we have a accessToken set in state, let's assume that we should be passing it.
    if (accessToken) {
      headers.set("authorization", `${accessToken}`);
    }

    return headers;
  },
});

//https://redux-toolkit.js.org/rtk-query/usage/customizing-queries#automatic-re-authorization-by-extending-fetchbasequery

// refresh accessToken jeno behind the scene generate korte pari
const fetchQueryWithRefToken: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);
  if (result?.error?.status === 401) {
    //* Send Refresh
    console.log("Sending refresh accessToken");

    const res = await fetch(
      "http://localhost:5000/api/v1/auth/refresh-accessToken",
      {
        method: "POST",
        credentials: "include",
      },
    );

    const data = await res.json();

    if (data?.data?.accessToken) {
      const user = (api.getState() as RootState).auth.user;

      api.dispatch(
        setCredentials({
          user,
          accessToken: data.data.accessToken,
        }),
      );

      result = await baseQuery(args, api, extraOptions);
    } else {
      api.dispatch(logout());
    }
  }

  return result;
};

// Define a service using a base URL and expected endpoints
// https://redux-toolkit.js.org/rtk-query/overview
export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: fetchQueryWithRefToken,
  tagTypes: ["User", "Student", "Roadmap", "Progress", "Chat"],
  endpoints: () => ({}),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
