import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const airflowApi = createApi({
//   baseQuery: fetchBaseQuery({ baseUrl: 'https://pokeapi.co/api/v2/' }),
  //baseQuery: fetchBaseQuery({ baseUrl: 'http://192.168.18.17:4000/' }),
//   baseQuery: fetchBaseQuery({ baseUrl: 'http://redpanda.sytes.net:4000/' }),
  reducerPath:'airflowApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://redpanda.sytes.net:8080/api/v1/' ,
                            prepareHeaders: (headers)=>{
                                headers.set("Authorization","Basic YWlyZmxvdzphaXJmbG93")
                                return headers
                            } }),
//   baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:8080/api/v1/' ,
//                             prepareHeaders: (headers)=>{
//                                 headers.set("Authorization","Basic YWlyZmxvdzphaXJmbG93")
//                                 return headers
//                             } }),
  tagTypes: [],
  endpoints: (builder) => ({
    getDagsList: builder.query<{dags:[{dag_id:string}]},string>({
      query: () => 'dags?tags=MLOps',
    }),

  }),
})

// Export hooks for usage in functional components
export const { useLazyGetDagsListQuery,
                } = airflowApi
