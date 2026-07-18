import { baseApi } from "../../baseApi";

export const chatApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    sendChatMessage: builder.mutation({
      // body: { message, language, roadmapWeekContext }
      query: (body) => ({
        url: "/chat-tutor",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Chat"],
    }),
    // getChatHistory: builder.query({
    //   query: (params) => ({ url: "/chat/history", params }),
    //   providesTags: ["Chat"],
    // }),
  }),
});

export const { useSendChatMessageMutation } = chatApi;
