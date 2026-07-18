import type {
  ListStudentsParams,
  ListStudentsResponse,
} from "../../../../type";
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
    listStudents: builder.query<ListStudentsResponse, ListStudentsParams>({
      query: ({ page, limit, searchTerm }) => ({
        url: "/admin/student-list",
        method: "GET",
        params: { page, limit, ...(searchTerm ? { searchTerm } : {}) },
      }),
      providesTags: ["Student"],
    }),
    getStudentById: builder.query({
      query: (id) => `/admin/students/${id}`,
      providesTags: (id) => [{ type: "Student", id }],
    }),
    updateStudentStatus: builder.mutation({
      // body: { status: 'in-progress' | 'blocked' }
      query: ({ id, ...body }) => ({
        url: `/admin/students/${id}/status`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Student", id },
        { type: "Student", id: "LIST" },
      ],
    }),
    deleteStudent: builder.mutation({
      query: (id) => ({
        url: `/admin/students/${id}`,
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