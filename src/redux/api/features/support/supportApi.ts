import { baseApi } from "../../baseApi";

export type TSupportCategory = "coding" | "mental" | "guidance" | "general";

export type TSupportLanguage = "EN" | "BN";

export interface TStartSupportSessionResponse {
  sessionId: string;
  token: string;
  model: string;
  expiresAt: string;
  durationMs: number;
}

// Shape your Express controllers actually send: res.json({ success, data }).
// Every endpoint's raw response looks like this before transformResponse
// unwraps it.
interface TApiEnvelope<T> {
  success: boolean;
  data: T;
}

export const supportApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    startSupportSession: builder.mutation<
      TStartSupportSessionResponse,
      {
        category: TSupportCategory;
        language: TSupportLanguage;
      }
    >({
      query: (body) => ({
        url: "/support",
        method: "POST",
        body,
      }),
      // Without this, .unwrap() returns { success, data } instead of the
      // { sessionId, token, model, ... } the hook destructures — that's why
      // `token` was undefined and GoogleGenAI threw "API Key must be set".
      transformResponse: (response: TApiEnvelope<TStartSupportSessionResponse>) =>
        response.data,
    }),

    endSupportSession: builder.mutation<
      void,
      {
        sessionId: string;
      }
    >({
      query: ({ sessionId }) => ({
        url: `/support/${sessionId}/end`,
        method: "PATCH",
      }),
    }),

    submitSupportFeedback: builder.mutation<
      void,
      {
        sessionId: string;
        rating: number;
        feedback?: string;
      }
    >({
      query: ({ sessionId, ...body }) => ({
        url: `/support/${sessionId}/feedback`,
        method: "POST",
        body,
      }),
    }),
  }),
});

export const {
  useStartSupportSessionMutation,
  useEndSupportSessionMutation,
  useSubmitSupportFeedbackMutation,
} = supportApi;