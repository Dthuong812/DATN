import {  userApi } from "@/store/AxiosCustom";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const permissionApi = createApi({
    reducerPath: "PermissionApi",
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
    tagTypes: ['Permission'],
    endpoints: (builder) => ({
        getPermissions: builder.query({
            query: () => "/permissions",
            providesTags: ['Permission'],
        })
        
    }),

})
export const {
    useGetPermissionsQuery,
} = permissionApi;