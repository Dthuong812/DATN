import { apiURL } from "@/store/AxiosCustom";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const baoCaoApi = createApi({
  reducerPath: "baoCaoApi",
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
  tagTypes: ["BaoCao"],
  endpoints: (builder) => ({
    getBaoCaoView: builder.query({
      query: (params) => {
        const queryString = new URLSearchParams({
          startTime: params?.startTime || "",
          endTime: params?.endTime || "",
        }).toString();
        return `/baocao/view?${queryString}`;
      },
      providesTags: ["BaoCao"],
    }),


    getBaoCaoSummary: builder.query({
      query: (params) => {
        const queryString = new URLSearchParams({
          objectCode: params?.objectCode || "",
          startTime: params?.startTime || "",
          endTime: params?.endTime || "",
        }).toString();
        return `/baocao/summary?${queryString}`;
      },
      providesTags: ["BaoCao"],
    }),

  }),
});

export const {
  useGetBaoCaoViewQuery,
  useGetBaoCaoSummaryQuery,
  useLazyGetBaoCaoViewQuery,
  useLazyGetBaoCaoSummaryQuery,
} = baoCaoApi;
