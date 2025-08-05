import api from '@/store/AxiosCustom';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const locationsApi = createApi({
  reducerPath: 'locationsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: api.defaults.baseURL,
    prepareHeaders: (headers ,{endpoint}) => {
      const token = localStorage.getItem("token");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
        if (endpoint !== "importLocations") {
          headers.set("Content-Type", "application/json");
        }
      }
      return headers;
    },
  }),
  tagTypes: ['Location'],
  endpoints: (builder) => ({
    getLocations: builder.query({
      query: () => '/locations', 
    }),

    deleteLocation: builder.mutation({
      query: (id) => ({
        url: `/locations/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Location'],
    }),
    addLocation: builder.mutation({
      query: (newLocation) => ({
        url: '/locations',
        method: 'POST',
        body: newLocation,
      }),
      invalidatesTags: ['Location'],
    }),
    updateLocation: builder.mutation({
      query: ({ id, ...updatedLocation }) => ({
        url: `/locations/${id}`,
        method: 'PATCH',
        body: updatedLocation,
      }),
      invalidatesTags: ['Location'],
    }),
    getLocationById: builder.query({
      query: (id) => `/locations/${id}`,
      providesTags: (_, __, id) => [{ type: 'Location', id }],
    }),
    importLocations:builder.mutation({
      query: (formData) => ({
        url: 'locations/import',
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: ['Location'],
    }),
  }),
});

export const { useGetLocationsQuery ,useDeleteLocationMutation,useAddLocationMutation ,useUpdateLocationMutation, useGetLocationByIdQuery,useImportLocationsMutation} = locationsApi;
