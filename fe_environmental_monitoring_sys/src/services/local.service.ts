import { apiURL } from "@/store/AxiosCustom";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const localApi = createApi({
    reducerPath: "localApi",
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
    tagTypes: ['Local'],
    endpoints: (builder) => ({
        getLocals: builder.query({
            query: () => "/local",
            providesTags: ['Local'],
        }),
        getLocalById: builder.query({
            query: (id) => `/local/${id}`,
            providesTags: (_, __, id) => [{ type: "Local", id }],
          }),
        
    }),

})
export const {
    useGetLocalByIdQuery,
    useGetLocalsQuery,
} = localApi;