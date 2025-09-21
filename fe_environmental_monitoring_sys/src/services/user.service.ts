import { userApi } from "@/store/AxiosCustom";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";


export const usersApi = createApi({
  reducerPath: "usersApi",
  baseQuery: fetchBaseQuery({
    baseUrl: userApi.defaults.baseURL,
    prepareHeaders: (headers, { endpoint }) => {
      const token = localStorage.getItem("token");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
        if (endpoint !== "importOrganizations") {
          headers.set("Content-Type", "application/json");
        }
      }
      return headers;
    },
  }),
  tagTypes: ["Users"],
  endpoints: (builder) => ({
    getUsers: builder.query({
        query: () => "/users",
        providesTags: ["Users"],
      }),
    getUserById: builder.query({
      query: (id) => `/users/${id}`,
      providesTags: (_, __, id) => [{ type: "Users", id }],
    }),
    addUser: builder.mutation({
      query: (user) => ({
        url: "/users",
        method: "POST",
        body: user,
      }),
      invalidatesTags: ["Users"],
    }),
    updateUser: builder.mutation({
      query: ({ id, ...patch }) => ({
        url: `/users/${id}`,
        method: "PATCH",

        body: patch,
      }),

      invalidatesTags: (_, __, { id }) => [{ type: "Users", id }],
    }),
    deleteUser: builder.mutation({
      query: (id) => ({
        url: `/users/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Users"],
    }),
    importUsers: builder.mutation({
      query: (formData) => ({
        url: "/users/import",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Users"],
    }),
    lockUser: builder.mutation({
      query: (id) => ({
        url: `/auth/lock-user/${id}`,
        method: "PATCH",
      }),
      invalidatesTags: ["Users"],
    }),
    unlockUser: builder.mutation({
      query: (id) => ({
        url: `/auth/unlock-user/${id}`,
        method: "PATCH",
      }),
      invalidatesTags: ["Users"],
    }),
  }),
});
export const {
    useGetUsersQuery,
    useGetUserByIdQuery,
    useAddUserMutation,
    useUpdateUserMutation,
    useDeleteUserMutation,
    useImportUsersMutation,
    useLazyGetUserByIdQuery,
    useLockUserMutation,
    useUnlockUserMutation
} = usersApi;
