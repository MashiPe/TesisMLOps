import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../store";
import { IExperiment } from "../../storetypes";


interface experimentsSliceState{
    experiments: IExperiment[]
}

const initialState : experimentsSliceState = {
    experiments: [ 
        {
            link: 'http://example.com/1',
            description: 'Mock Experiment 1',
            name: 'Test Experiment 1'    
        } as IExperiment,
        {
            link: 'http://example.com/2',
            description: 'Mock Experiment 2',
            name: 'Test Experiment 2'    
        } as IExperiment,
        {
            link: 'http://example.com/3',
            description: 'Mock Experiment 3',
            name: 'Test Experiment 3'    
        } as IExperiment,
        {
            link: 'http://example.com/4',
            description: 'Mock Experiment 4',
            name: 'Test Experiment 4'    
        } as IExperiment,

    ] 
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