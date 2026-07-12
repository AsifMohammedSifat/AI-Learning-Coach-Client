import { baseApi } from "../../baseApi";

//https://redux-toolkit.js.org/rtk-query/usage/code-splitting?utm_source=chatgpt.com
const authApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    login: build.mutation({
      query: (userInfo) => ({
        url: `/auth/login`,
        method: "POST",
        body: userInfo,
      }),
    }),
  }),
});

export const { useLoginMutation } = authApi;
