import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../store";
import { IExperiment, IOperator, OperatorDefinition } from "../../storetypes";

interface subGroup{
    title: string,
    operators: string[],
}

interface OperatorGroup{

    groups: subGroup[]    

}

interface operatorDefinitionSliceState{
    definitions: { [key:string]: OperatorDefinition }
    operatorsGroups: { [key:string]: OperatorGroup }
    defaultValues: { [key:string]: IOperator}
    // defaults : { [key: string] : IOperato }   
}

const initialState : operatorDefinitionSliceState = {
    definitions : {
                    "noOp":{
                        inputDef: { 
                            datasetInputs: 0,
                            modelInputs: 0
                        }, 
                        outputDef: {
                            datasetOutput:0,
                            modelOutputs: 0,
                            graphicsOutput:0
                        },
                        paramsDef:[]
                    } as OperatorDefinition,
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
                            datasetInputs: 1,
                            modelInputs: 0,
                        },
                        outputDef: {
                            datasetOutput:1,
                            modelOutputs: 0,
                            graphicsOutput:0
                        },
                        paramsDef:[
                            {
                                name:'Encode Map',
                                type:'map'
                            },
                            {
                                name: 'Class',
                                type: 'string'
                            }
                        ]} as OperatorDefinition},
    operatorsGroups : {
        'Data Preparation':{
            groups: [ {
                title:'Data Ingest',
                operators: ['DefaultReader']
            } as subGroup,{
                title:'Transformation',
                operators: ['EncodeColumn']
            } as subGroup] 
        } as OperatorGroup,
        'Modeling':{ groups:[]}as OperatorGroup,
        'Evaluation':{ groups:[]}as OperatorGroup,
    },
    defaultValues:{
        'DefaultReader': {
            env:'Python',
            input:[''],
            output:[''],
            op_type:'DefaultReader',
            parameters:{
                'limit':100
            }
        }as IOperator,
        'EncodeColumn':{
            env:'Python',
            input:[''],
            output:[''],
            op_type:'EncodeColumn',
            parameters:{
                'class':'',
                'Encode Map':{}
            }
        }
    }
    
}

export const operatorDefinitionSlice = createSlice({
    name: 'operatorDefinition',
    initialState,
    reducers:{
    }
})


export const {  } = operatorDefinitionSlice.actions

export const selectOperatorDefinitionState = (state:RootState) => state.opdefinitions.definitions
export const selectGroups = (state:RootState) => state.opdefinitions.operatorsGroups
export const selectDefaults = (state:RootState) => state.opdefinitions.defaultValues

export default operatorDefinitionSlice.reducer