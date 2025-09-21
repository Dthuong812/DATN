import { userApi } from "@/store/AxiosCustom";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const roleApi = createApi({
  reducerPath: "roleApi",
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
  tagTypes: ["Role"],
  endpoints: (builder) => ({
    getRoles: builder.query({
      query: () => "/roles",
      providesTags: ["Role"],
    }),
    getRoleById: builder.query({
      query: (id) => `/roles/${id}`,
      providesTags: (_, __, id) => [{ type: "Role", id }],
    }),
    updateRole: builder.mutation({
      query: ({ id, ...patch }) => ({
        url: `/roles/${id}`,
        method: "PATCH",
        body: patch,
      }),
      invalidatesTags: ["Role"],
    }),
    deleteRole: builder.mutation({
      query: (id) => ({
        url: `/roles/${id}`,
        method: "DELETE",
      }),
    }),
    createRole: builder.mutation({
      query: (newRole) => ({
        url: "/roles",
        method: "POST",
        body: newRole,
      }),
      invalidatesTags: ["Role"],
    }),
  }),
});
export const {
  useGetRolesQuery,
  useGetRoleByIdQuery,
  useUpdateRoleMutation,
  useDeleteRoleMutation,
  useCreateRoleMutation,
  useLazyGetRoleByIdQuery,
} = roleApi;
