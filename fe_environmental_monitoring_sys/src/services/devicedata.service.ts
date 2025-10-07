import { apiURL } from "@/store/AxiosCustom";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const deviceDataApi = createApi({
  reducerPath: "deviceDataApi",
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
  tagTypes: ["DeviceData"],
  endpoints: (builder) => ({
    getDeviceDatas: builder.query({
      query: (filters) => {
        const params = new URLSearchParams();
        if (filters?.page) params.append("page", filters.page);
        if (filters?.pageSize) params.append("pageSize", filters.pageSize);
        if (filters?.Devices_Code)
          params.append("Devices_Code", filters.Devices_Code);
        if (filters?.Project_Code)
          params.append("Project_Code", filters.Project_Code);
        if (filters?.Object_Code)
          params.append("Object_Code", filters.Object_Code);
        if (filters?.DataType)
          params.append("DataType", filters.DataType);
        return `/device-data?${params.toString()}`;
      },
      keepUnusedDataFor: 0,
      providesTags: ["DeviceData"],
    }),
    getLatestDeviceDatas: builder.query({
      query: () => `/device-data/latest`,
      keepUnusedDataFor: 0,
      providesTags: ["DeviceData"],
    }),
  }),
});
export const { useGetDeviceDatasQuery,useGetLatestDeviceDatasQuery } = deviceDataApi;
