import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '../../store';
import { DatasetVersion, IDataset, MetaRecord, Preview } from '../../storetypes';


interface DatasetSliceState{
    datasets: {[key:string]:IDataset}
}

const initialState:DatasetSliceState = {
    datasets:{
    }
}

const datasetSlice = createSlice({
  name: 'datasets',
  initialState,
  reducers: {
    addVersion: (state,action: PayloadAction<{datasetKey:string,datasetVersion:DatasetVersion}>)=>{
        state.datasets[action.payload.datasetKey].versions.push(action.payload.datasetVersion)
    },
    addDataset: (state,action: PayloadAction<IDataset>)=>{
        const datasetKey = action.payload.name.replace(" ","").toLowerCase()
        state.datasets[datasetKey]=action.payload
    },
    setVersionRecords: (state,action:PayloadAction<{
                                        datasetKey:string,
                                        versionIndex:number,
                                        records: {[key:string]:string}[]}>)=>{
        const datasetKey = action.payload.datasetKey
        const versionIndex = action.payload.versionIndex
        const records = action.payload.records satisfies {[key:string]:string|number}[]
        state.datasets[datasetKey].versions[versionIndex].preview.records= records
    }
  }
});

export const {addVersion,addDataset,setVersionRecords} = datasetSlice.actions

export const selectDatasets = (state: RootState) => state.datasets.datasets
// export const selectDatasetLink= (state: RootState) => state.datasets.datasets

export default datasetSlice.reducer