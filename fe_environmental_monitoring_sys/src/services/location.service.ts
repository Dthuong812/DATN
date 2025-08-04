import api from '@/store/AxiosCustom';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const locationsApi = createApi({
  reducerPath: 'locationsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: api.defaults.baseURL,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
        headers.set("Content-Type", "application/json");
      }
      return headers;
    },
  }),
  tagTypes: ['Location'],
  endpoints: (builder) => ({
    getLocations: builder.query({
      query: () => '/locations', 
    }),
  }),
});

export const { useGetLocationsQuery } = locationsApi;
