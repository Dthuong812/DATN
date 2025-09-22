import { userApi } from "@/store/AxiosCustom";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const LogsApi = createApi({
  reducerPath: "LogsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: userApi.defaults.baseURL,
    prepareHeaders: (headers, { endpoint }) => {
      const token = localStorage.getItem("token");
        if (token) {
            headers.set("Authorization", `Bearer ${token}`);
            if (endpoint !== "importLogs") {
                headers.set("Content-Type", "application/json");
            }
        }
        return headers;
    },
    }),
    tagTypes: ["Logs"],
    endpoints: (builder) => ({
        getLogs: builder.query({
            query: (filters) => {
              const params = new URLSearchParams();
              if (filters?.page) params.append("page", filters.page);
              if (filters?.pageSize) params.append("pageSize", filters.pageSize);
              if (filters?.LogTypeId) params.append("LogTypeId", filters.LogTypeId);
              if (filters?.Action) params.append("Action", filters.Action);
              if (filters?.Service) params.append("Service", filters.Service);
              if (filters?.Method) params.append("Method", filters.Method);
              if (filters?.startDate) params.append("startDate", filters.startDate);
              if (filters?.endDate) params.append("endDate", filters.endDate);
              return `/logs?${params.toString()}`;
            },
            keepUnusedDataFor: 0,
            providesTags: ["Logs"],
          }),

    }),
});
export const { useGetLogsQuery } = LogsApi;