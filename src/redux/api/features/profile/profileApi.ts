import { baseApi } from "../../baseApi";

export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMyProfile: builder.query({
      query: () => "/users/me",
      providesTags: ["User"],
    }),
    updateMyProfile: builder.mutation({
      query: (body) => ({
        url: "/users/me",
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["User"],
    }),
    listStudents: builder.query({
      // admin: params = { search, status, page, limit }
      query: (params) => ({ url: "/users/students", params }),
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ _id }: { _id: string }) => ({ type: "Student", id: _id })),
              { type: "Student", id: "LIST" },
            ]
          : [{ type: "Student", id: "LIST" }],
    }),
    getStudentById: builder.query({
      query: (id) => `/users/students/${id}`,
      providesTags: (id) => [{ type: "Student", id }],
    }),
    updateStudentStatus: builder.mutation({
      // body: { status: 'active' | 'suspended' }
      query: ({ id, ...body }) => ({
        url: `/users/students/${id}/status`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ({ id }) => [
        { type: "Student", id },
        { type: "Student", id: "LIST" },
      ],
    }),
    deleteStudent: builder.mutation({
      query: (id) => ({
        url: `/users/students/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Student", id: "LIST" }],
    }),
  }),
});

export const {
  useGetMyProfileQuery,
  useUpdateMyProfileMutation,
  useListStudentsQuery,
  useGetStudentByIdQuery,
  useUpdateStudentStatusMutation,
  useDeleteStudentMutation,
} = userApi;
