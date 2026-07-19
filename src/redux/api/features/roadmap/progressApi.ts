import { baseApi } from "../../baseApi";

export const progressApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // getMyProgress: builder.query({
    //   query: () => "/progres/me",
    //   providesTags: ["Progress"],
    // }),
    updateProgress: builder.mutation({
      // id = roadmap item / topic id
      query: ({ id, ...body }) => ({
        url: `/roadmap/week/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Progress", "Roadmap"],
    }),
    // getStudentProgress: builder.query({
    //   // admin view of a specific student
    //   query: (studentId) => `/progress/student/${studentId}`,
    //   providesTags: (studentId) => [{ type: "Progress", id: studentId }],
    // }),
  }),
});

export const {
  // useGetMyProgressQuery,
  useUpdateProgressMutation,
  // useGetStudentProgressQuery,
} = progressApi;
