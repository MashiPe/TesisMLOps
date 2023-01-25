import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { IDataset, IExperiment, IVersion } from '../storetypes'

export const expApi = createApi({
//   baseQuery: fetchBaseQuery({ baseUrl: 'https://pokeapi.co/api/v2/' }),
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:4000/' }),
  tagTypes: [],
  endpoints: (builder) => ({
    getExperimentList: builder.query<IExperiment[],string>({
      query: () => 'explist',
    }),
    getDatasetsList: builder.query<IDataset[],string>({
      query: () => 'datasetlist',
    }),
    getExperimentInfo: builder.query<IExperiment,string>({
      query: (expIri) => {
        console.log("Fetching",expIri)
        return `exp/${expIri}`
      },
    }),
    getDatasetVersionPreview: builder.query<{[key:string]:string}[],string>({
      query: (table) => `gettable/${table}`,
    }),
    postExperimentVersion: builder.mutation<IVersion,{exp_iri:string,version_name:string}>({
        query: ({exp_iri,version_name})=>{
            
            const post_body = { exp_iri: exp_iri, version_info: { name:version_name } }
            
            console.log("Postbody",post_body)

            return{
                url:'exp/version',
                method:'POST',
                body: post_body,
            }
        }
    }),
    postExperiment: builder.mutation<IExperiment,IExperiment>({
        query: (body)=>{
            
            const post_body = { new_exp: body }

            return{
                url:'newexp',
                method:'POST',
                body: post_body,
            }
        }
    }),
    
    postDataset: builder.mutation<IDataset,IDataset>({
        query: (body)=>{
            
            const post_body = { new_dataset: body }

            return{
                url:'newdataset',
                method:'POST',
                body: post_body,
            }
        }
    })
  }),
})

// Export hooks for usage in functional components
export const { useGetExperimentListQuery,
                usePostExperimentMutation, 
                usePostDatasetMutation,
                useGetDatasetsListQuery,
                useLazyGetDatasetVersionPreviewQuery,
                useLazyGetExperimentInfoQuery,
                useGetExperimentInfoQuery,
                usePostExperimentVersionMutation} = expApi