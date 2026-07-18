import { baseApi } from "../../baseApi";

export const roadmapApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    generateRoadmap: builder.mutation({
      // body: { goal, currentLevel, hoursPerDay, language }
      query: (body) => ({
        url: "/roadmap/",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Roadmap"],
    }),
    getMyRoadmap: builder.query({
      query: () => "/roadmap/me",
      providesTags: ["Roadmap"],
    }),
    getRoadmapById: builder.query({
      query: (roadmapId) => `/roadmap/${roadmapId}`,
      providesTags: ( roadmapId) => [
        { type: "Roadmap", id: roadmapId },
      ],
    }),
    listRoadmaps: builder.query({
      // admin: list every student's roadmap, optionally filtered
      query: (params) => ({ url: "/roadmap/", params }),
      providesTags: ["Roadmap"],
    }),
  }),
});

export const {
  useGenerateRoadmapMutation,
  useGetMyRoadmapQuery,
  useGetRoadmapByIdQuery,
  useListRoadmapsQuery,
} = roadmapApi;
