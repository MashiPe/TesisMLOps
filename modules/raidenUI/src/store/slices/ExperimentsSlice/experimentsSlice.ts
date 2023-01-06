import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../store";
import { IExperiment } from "../../storetypes";


interface experimentsSliceState{
    experiments: IExperiment[]
}

const initialState : experimentsSliceState = {
    experiments: [] 
}

export const experimentsSlice = createSlice({
    name: 'experiments',
    initialState,
    reducers:{
        addExperiment : (state,action:PayloadAction<IExperiment>)=>{
            state.experiments = [...state.experiments,action.payload] 
        }
    }
})


export const { addExperiment } = experimentsSlice.actions

export const selectExperimentList = (state:RootState) => state.experiments.experiments

export default experimentsSlice.reducer