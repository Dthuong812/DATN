import { apiURL } from "@/store/AxiosCustom";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const objectApi = createApi({
  reducerPath: "objectApi",
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
  tagTypes: ["Object"],
  endpoints: (builder) => ({
    getObject: builder.query({
      query: (filters) => {
        const params = new URLSearchParams();
        if (filters?.page) params.append("page", filters.page);
        if (filters?.pageSize) params.append("pageSize", filters.pageSize);
        if (filters?.Code) params.append("Code", filters.Code);
        if (filters?.Name) params.append("Name", filters.Name);
        if (filters?.Organization_Code)
          params.append("Organization_Code", filters.Organization_Code);
        if (filters?.Project_Code)
          params.append("Project_Code", filters.Project_Code);
        if (filters?.Status) params.append("Status", filters.Status);
        if (filters?.Address) params.append("Address", filters.Address);
        if (filters?.Connection_Type)
          params.append("Connection_Type", filters.Connection_Type);
        if (filters?.Installation_Date)
          params.append("Installation_Date", filters.Installation_Date);
        if (filters?.Last_Maintenance_Date)
          params.append("Last_Maintenance_Date", filters.Last_Maintenance_Date);
        return `/object?${params.toString()}`;
      },
      keepUnusedDataFor: 0,
      providesTags: ["Object"],
    }),
    addObject: builder.mutation({
      query: (newObject) => ({
        url: "/object",
        method: "POST",
        body: newObject,
      }),
      invalidatesTags: ["Object"],
    }),
    updateObject: builder.mutation({
      query: ({ id, ...updatedObject }) => ({
        url: `/object/${id}`,
        method: "PATCH",
        body: updatedObject,
      }),
      invalidatesTags: ["Object"],
    }),
    deleteObject: builder.mutation({
      query: (id) => ({
        url: `/object/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Object"],
    }),
    getObjectById: builder.query({
      query: (id) => `/object/${id}`,
      providesTags: (_, __, id) => [{ type: "Object", id }],
    }),
  }),
});
export const {
  useGetObjectQuery,
  useAddObjectMutation,
  useUpdateObjectMutation,
  useDeleteObjectMutation,
  useGetObjectByIdQuery,
} = objectApi;
