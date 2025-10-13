import { apiURL } from "@/store/AxiosCustom";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const alertApi = createApi({
  reducerPath: "alertApi",
  baseQuery: fetchBaseQuery({
    baseUrl: apiURL.defaults.baseURL,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
        headers.set("Content-Type", "application/json");
      }
      return headers;
    },
  }),
  tagTypes: ["Alert"],
  endpoints: (builder) => ({
    getAlerts: builder.query({
      query: (params) => {
        const search = new URLSearchParams(params || {}).toString();
        return `/alerts?${search}`;
      },
      providesTags: ["Alert"],
    }),
    getAlertById: builder.query({
      query: (id) => `/alerts/${id}`,
      providesTags: (_, __, id) => [{ type: "Alert", id }],
    }),
    markAlertAsRead: builder.mutation({
      query: (id) => ({
        url: `/alerts/${id}/read`,
        method: "PATCH",
      }),
      invalidatesTags: ["Alert"],
    }),
    markAllAlertsAsRead: builder.mutation({
      query: () => ({
        url: `/alerts/read-all`,
        method: "PATCH",
      }),
      invalidatesTags: ["Alert"],
    }),
    deleteAlert: builder.mutation({
      query: (id) => ({
        url: `/alerts/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Alert"],
    }),
  }),
});

export const {
  useGetAlertsQuery,
  useGetAlertByIdQuery,
  useMarkAlertAsReadMutation,
  useMarkAllAlertsAsReadMutation,
  useDeleteAlertMutation,
} = alertApi;