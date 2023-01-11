import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../store";
import { IExperiment, IOperator, OperatorDefinition } from "../../storetypes";


interface operatorDefinitionSliceState{
    definitions: { [key:string]: OperatorDefinition }
    // defaults : { [key: string] : IOperato }   
}

const initialState : operatorDefinitionSliceState = {
    definitions : { 
                    "DefaultReader": { 
                        inputDef: { 
                            datasetInputs: 1,
                            modelInputs: 0
                        }, 
                        outputDef: {
                            datasetOutput:1,
                            modelOutputs: 0,
                            graphicsOutput:0
                        },
                        paramsDef:[
                            {
                                name:'limit',
                                type:'number'
                            }
                        ]} as OperatorDefinition,
                    "EncodeColumn":{
                        inputDef:{
                            datasetInputs: 2,
                            modelInputs: 1,
                        },
                        outputDef: {
                            datasetOutput:1,
                            modelOutputs: 0,
                            graphicsOutput:2
                        },
                        paramsDef:[
                            {
                                name:'Encode Map',
                                type:'map'
                            },
                            {
                                name:'Encode Map1',
                                type:'map'
                            },
                            {
                                name:'Encode Map2',
                                type:'map'
                            },
                            {
                                name: 'Test List',
                                type: 'list'
                            }
                        ]} as OperatorDefinition}
}

export const operatorDefinitionSlice = createSlice({
    name: 'operatorDefinition',
    initialState,
    reducers:{
    }
})


export const {  } = operatorDefinitionSlice.actions

export const selectOperatorDefinitionState = (state:RootState) => state.opdefinitions.definitions

export default operatorDefinitionSlice.reducer