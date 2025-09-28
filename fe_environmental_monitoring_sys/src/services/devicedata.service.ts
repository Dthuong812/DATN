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
        query: () => "/device-data",
        providesTags: ['DeviceData'],
    }),
  }),
});
export const {
  useGetDeviceDatasQuery,

} = deviceDataApi;
