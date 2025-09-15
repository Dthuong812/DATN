import { userApi } from "@/store/AxiosCustom";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const functionApi = createApi({
    reducerPath: "functionApi",
    baseQuery: fetchBaseQuery({
        baseUrl: userApi.defaults.baseURL,
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
    tagTypes: ['Function'],
    endpoints: (builder) => ({
        getFunctions: builder.query({
            query: () => "/functions",
            providesTags: ['Function'],
        })
        
    }),

})
export const {
    useGetFunctionsQuery,
} = functionApi;