import { apiURL } from "@/store/AxiosCustom";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const configApi = createApi({
    reducerPath: "configApi",
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
    tagTypes: ['SensorConfig'],
    endpoints: (builder) => ({
        getConfigs: builder.query({
            query: () => "/config",
            providesTags: ['SensorConfig'],
        }),
        getConfigById: builder.query({
            query: (id) => `/config/${id}`,
            providesTags: (_, __, id) => [{ type: "SensorConfig", id }],
          }),
        
    }),

})
export const {
    useGetConfigByIdQuery,
    useGetConfigsQuery,
} = configApi;