import api from "@/store/AxiosCustom";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const stationsApi = createApi({
  reducerPath: "stationsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: api.defaults.baseURL,
    prepareHeaders: (headers ,{endpoint}) => {
      const token = localStorage.getItem("token");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
        if (endpoint !== "importStations") {
          headers.set("Content-Type", "application/json");
        }
      }
      return headers;
    },
  }),
  tagTypes: ['Station'],
  endpoints: (builder) => ({
    getStations: builder.query({
      query: () => "/stations",
      providesTags: ['Station'],
    }),

    addStation: builder.mutation({
      query: (newStation) => ({
        url: "/stations",
        method: "POST",
        body: newStation,
      }),
    }),

    updateStation: builder.mutation({
      query: ({ id, ...updatedStation }) => ({
        url: `/stations/${id}`,
        method: "PUT",
        body: updatedStation,
      }),
      invalidatesTags: ['Station'],
    }),

    deleteStation: builder.mutation({
      query: (id) => ({
        url: `/stations/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ['Station'],
    }),

    getStationById: builder.query({
      query: (id) => `/stations/${id}`,
      providesTags: (result, error, id) => [{ type: 'Station', id }],
    }),

    importStations: builder.mutation({
      query: (formData) => ({
        url: 'stations/import',
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: ['Station'],
    }),
  }),
});

export const { useGetStationsQuery , useAddStationMutation ,useDeleteStationMutation ,useUpdateStationMutation , useGetStationByIdQuery ,useImportStationsMutation} = stationsApi;