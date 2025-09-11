import { apiURL } from "@/store/AxiosCustom";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const projectsApi = createApi({
    reducerPath: "projectsApi",
    baseQuery: fetchBaseQuery({
      baseUrl: apiURL.defaults.baseURL,
      prepareHeaders: (headers ,{endpoint}) => {
        const token = localStorage.getItem("token");
        if (token) {
          headers.set("Authorization", `Bearer ${token}`);  
            if (endpoint !== "importProjects") {
                headers.set("Content-Type", "application/json");
            }
        }
        return headers;
        },
    }),
    tagTypes: ['Project'],
    endpoints: (builder) => ({
        getProjects: builder.query({
            query: () => "/project",
            providesTags: ['Project'],
        }),
        addProject: builder.mutation({
            query: (newProject) => ({
                url: "/project",
                method: "POST",

                body: newProject,
            }),
            invalidatesTags: ['Project'],
        }),
        updateProject: builder.mutation({
            query: ({ id, ...updatedProject }) => ({
                url: `/project/${id}`,
                method: "PATCH",
                body: updatedProject,

            }),
            invalidatesTags: ['Project'],
        }),         
        deleteProject: builder.mutation({
            query: (id) => ({
                url: `/project/${id}`,
                method: "DELETE",
            }),     
            invalidatesTags: ['Project'],   
        }), 
        getProjectById: builder.query({
            query: (id) => `/project/${id}`,
            providesTags: (_, __, id) => [{ type: 'Project', id }],
        })
    }),
});
export const {
    useGetProjectsQuery,
    useAddProjectMutation,
    useUpdateProjectMutation,
    useDeleteProjectMutation,
    useGetProjectByIdQuery
} = projectsApi;    