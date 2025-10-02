import { apiURL } from "@/store/AxiosCustom";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const deviceApi = createApi({
  reducerPath: "deviceApi",
  baseQuery: fetchBaseQuery({
    baseUrl: apiURL.defaults.baseURL,
    prepareHeaders: (headers, { endpoint }) => {
      const token = localStorage.getItem("token");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);

        if (endpoint !== "importDevices") {
          headers.set("Content-Type", "application/json");
        }
      }
      return headers;
    },
  }),
  tagTypes: ["Device"],
  endpoints: (builder) => ({
    getDevices: builder.query({
      query: (filters) => {
        const params = new URLSearchParams();
        if (filters?.page) params.append("page", filters.page);
        if (filters?.pageSize) params.append("pageSize", filters.pageSize);
        if (filters?.Code) params.append("Code", filters.Code);
        if (filters?.Name) params.append("Name", filters.Name);
        if (filters?.Object_Code) params.append("Object_Code", filters.Object_Code);
        if (filters?.DeviceType_Code) params.append("DeviceType_Code", filters.DeviceType_Code);
        if (filters?.Series) params.append("Series", filters.Series);
        return `/device?${params.toString()}`;
      },
      keepUnusedDataFor: 0,
      providesTags: ["Device"],
    }),
    getDeviceById: builder.query({
      query: (id) => `/device/${id}`,

      providesTags: (_, __, id) => [{ type: "Device", id }],
    }),
    addDevice: builder.mutation({
      query: (device) => ({
        url: "/device",
        method: "POST",
        body: device,
      }),
      invalidatesTags: ["Device"],
    }),
    updateDevice: builder.mutation({
      query: ({ id, ...patch }) => ({
        url: `/device/${id}`,
        method: "PATCH",
        body: patch,
      }),
      invalidatesTags: (_, __, { id }) => [{ type: "Device", id },{ type: "Device" },],
    }),
    deleteDevice: builder.mutation({
      query: (id) => ({
        url: `/device/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Device"],
    }),
    importDevices: builder.mutation({
      query: (formData) => ({
        url: "/device/import",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Device"],
    }),
  }),
});
export const {
  useGetDeviceByIdQuery,
  useGetDevicesQuery,
  useAddDeviceMutation,
  useUpdateDeviceMutation,
  useDeleteDeviceMutation,
  useImportDevicesMutation,
} = deviceApi;
