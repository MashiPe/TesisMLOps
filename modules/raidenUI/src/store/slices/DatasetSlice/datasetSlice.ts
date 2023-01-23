import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '../../store';
import { DatasetVersion, IDataset, MetaRecord, Preview } from '../../storetypes';


interface DatasetSliceState{
    datasets: {[key:string]:IDataset}
}

const initialState:DatasetSliceState = {
    datasets:{
        'DatasetTest': {
            name:'IrisDataset',
            versions: [
                {
                    version_name: 'iris',
                    tableName: 'iris',
                    preview: {
                    }as Preview
                } as DatasetVersion,
            ]
        } as IDataset
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
  }
});

export const {addVersion,addDataset} = datasetSlice.actions

export const selectDatasets = (state: RootState) => state.datasets.datasets

export default datasetSlice.reducer