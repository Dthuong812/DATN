import { apiURL } from "@/store/AxiosCustom";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const departmentApi = createApi({
    reducerPath: "departmentApi",
    baseQuery: fetchBaseQuery({
        baseUrl: apiURL.defaults.baseURL,
        prepareHeaders: (headers, { endpoint }) => {
          const token = localStorage.getItem("token");
            if (token) {
                headers.set("Authorization", `Bearer ${token}`);
                if (endpoint !== "importDepartments") {
                    headers.set("Content-Type", "application/json");
                }
            }
            return headers;
        },
        }),
    tagTypes: ['Department'],
    endpoints: (builder) => ({
        getDepartments: builder.query({
            query: (params) => {
              const search = new URLSearchParams(params?.filter || {}).toString();
              return `/department?${search}`;
            },
            providesTags: ['Department'],
          }),
        getDepartmentById: builder.query({
            query: (id) => `/department/${id}`,

            providesTags: (_, __, id) => [{ type: "Department", id }],
            }),
        addDepartment: builder.mutation({
            query: (department) => ({
                url: "/department",
                method: "POST",
                body: department,
            }),
            invalidatesTags: ['Department'],
        }),
        updateDepartment: builder.mutation({
            query: ({ id, ...patch }) => ({
                url: `/department/${id}`,
                method: "PATCH",
                body: patch,
            }),
            invalidatesTags: (_, __, { id }) => [{ type: "Department", id }],
        }),
        deleteDepartment: builder.mutation({
            query: (id) => ({
                url: `/department/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ['Department'],
        }),     
        importDepartments: builder.mutation({
            query: (formData) => ({
                url: "/department/import",
                method: "POST",
                body: formData,
            }),
            invalidatesTags: ['Department'],
            }),
    }),
})
export const {
    useGetDepartmentByIdQuery,
    useGetDepartmentsQuery,
    useAddDepartmentMutation,
    useUpdateDepartmentMutation,    
    useDeleteDepartmentMutation,
    useImportDepartmentsMutation,
} = departmentApi;
