import { apiURL } from "@/store/AxiosCustom";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const deviceTypeApi = createApi({
  reducerPath: "deviceTypeApi",
  baseQuery: fetchBaseQuery({
    baseUrl: apiURL.defaults.baseURL,
    prepareHeaders: (headers, { endpoint }) => {
      const token = localStorage.getItem("token");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);

        if (endpoint !== "importDeviceTypes") {
          headers.set("Content-Type", "application/json");
        }
      }
      return headers;
    },
  }),
  tagTypes: ["DeviceType"],
  endpoints: (builder) => ({
    getDeviceTypes: builder.query({
        query: () => "/device-type",
        providesTags: ['DeviceType'],
    }),
    getDeviceTypeById: builder.query({
      query: (id) => `/device-type/${id}`,

      providesTags: (_, __, id) => [{ type: "DeviceType", id }],
    }),
    addDeviceType: builder.mutation({
      query: (deviceType) => ({
        url: "/device-type",
        method: "POST",
        body: deviceType,
      }),
      invalidatesTags: ["DeviceType"],
    }),
    updateDeviceType: builder.mutation({
      query: ({ id, ...patch }) => ({
        url: `/device-type/${id}`,
        method: "PATCH",
        body: patch,
      }),
      invalidatesTags: (_, __, { id }) => [{ type: "DeviceType", id },{ type: "DeviceType" },],
    }),
    deleteDeviceType: builder.mutation({
      query: (id) => ({
        url: `/device-type/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["DeviceType"],
    }),
    importDeviceTypes: builder.mutation({
      query: (formData) => ({
        url: "/device-type/import",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["DeviceType"],
    }),
  }),
});
export const {
  useGetDeviceTypeByIdQuery,
  useGetDeviceTypesQuery,
  useAddDeviceTypeMutation,
  useUpdateDeviceTypeMutation,
  useDeleteDeviceTypeMutation,
  useImportDeviceTypesMutation,
} = deviceTypeApi;
