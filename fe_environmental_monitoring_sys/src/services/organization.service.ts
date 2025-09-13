import { apiURL } from "@/store/AxiosCustom";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const organizationApi = createApi({
  reducerPath: "organizationApi",
  baseQuery: fetchBaseQuery({
    baseUrl: apiURL.defaults.baseURL,
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
  tagTypes: ["Organization"],
  endpoints: (builder) => ({
    getOrganizations: builder.query({
      query: () => "/organization",
      providesTags: ["Organization"],
    }),
    addOrganization: builder.mutation({
      query: (newOrganization) => ({
        url: "/organization",
        method: "POST",
        body: newOrganization,
      }),
      invalidatesTags: ["Organization"],
    }),
    updateOrganization: builder.mutation({
      query: ({ id, ...updatedOrganization }) => ({
        url: `/organization/${id}`,
        method: "PATCH",
        body: updatedOrganization,
      }),
      invalidatesTags: ["Organization"],
    }),
    deleteOrganization: builder.mutation({
      query: (id) => ({
        url: `/organization/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Organization"],
    }),
    getOrganizationById: builder.query({
      query: (id) => `/organization/${id}`,
      providesTags: (_, __, id) => [{ type: "Organization", id }],
    }),
  }),
});
export const {
  useGetOrganizationsQuery,
  useAddOrganizationMutation,
  useUpdateOrganizationMutation,
  useDeleteOrganizationMutation,
  useGetOrganizationByIdQuery,
} = organizationApi;
