import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../store";
import { IExperiment, IOperator, OperatorDefinition, ParamsDefinition } from "../../storetypes";

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

export const globalDefinitions: {[key:string]:OperatorDefinition} = {
                    "CorrelationMatrix":{
                        inputDef: { 
                            datasetInputs: 1,
                            modelInputs: 0
                        }, 
                        outputDef: {
                            datasetOutput:0,
                            modelOutputs: 0,
                            graphicsOutput:1
                        },
                        paramsDef:[
                            {
                                name:'columns',
                                type:'list'
                            }
                        ]
                    } as OperatorDefinition,
                    "ConfusionMatrix":{
                        inputDef: { 
                            datasetInputs: 1,
                            modelInputs: 1
                        }, 
                        outputDef: {
                            datasetOutput:0,
                            modelOutputs: 0,
                            graphicsOutput:1
                        },
                        paramsDef:[
                        ]
                    } as OperatorDefinition,
                    "RM_Support_Vector_Machine":{
                        inputDef: { 
                            datasetInputs: 2,
                            modelInputs: 0
                        }, 
                        outputDef: {
                            datasetOutput:0,
                            modelOutputs: 1,
                            graphicsOutput:0
                        },
                        paramsDef:[
                            {
                                name:'kernel',
                                type:'string'
                            }
                        ]
                    } as OperatorDefinition,
                    "SplitData":{
                        inputDef: { 
                            datasetInputs: 1,
                            modelInputs: 0
                        }, 
                        outputDef: {
                            datasetOutput:2,
                            modelOutputs: 0,
                            graphicsOutput:0
                        },
                        paramsDef:[
                            {
                                name:'split_ratio',
                                type:'number'
                            }
                        ]
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
                    "ReformatData":{
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
                                name:'columns',
                                type:'complexMap',
                            } as ParamsDefinition,
                        ]} as OperatorDefinition}

const initialState : operatorDefinitionSliceState = {
    definitions : globalDefinitions,
    operatorsGroups : {
        'Data Preparation':{
            groups: [ {
                title:'Data Ingest',
                operators: ['DefaultReader']
            } as subGroup,{
                title:'Transformation',
                operators: ['ReformatData','SplitData']
            } as subGroup] 
        } as OperatorGroup,
        'Modeling':{ groups:[{
            title:'Modeling',
            operators:['RM_Support_Vector_Machine'],
        }]}as OperatorGroup,
        'Evaluation':{ groups:[
            {
                title:'Data Analysis',
                operators:['CorrelationMatrix']
            },
            {
                title:'Model Evaluation',
                operators:['ConfusionMatrix']
            }
        ]}as OperatorGroup,
    },
    defaultValues:{
        'test': {
            env:'Python',
            input:['',''],
            output:['','',''],
            op_type:'test',
            parameters:{
                'testp':100
            }
        }as IOperator,
        'DefaultReader': {
            env:'Python',
            input:[''],
            output:[''],
            op_type:'DefaultReader',
            parameters:{
                'limit':100
            }
        }as IOperator,
        'ReformatData':{
            env:'Python',
            input:[''],
            output:[''],
            op_type:'ReformatData',
            parameters:{
                'columns':{}
            }
        },
        'ConfusionMatrix':{
            env:'Python',
            input:[''],
            output:[''],
            op_type:'ConfussionMatrix',
            parameters:{
            }
        },
        'CorrelationMatrix':{
            env:'Python',
            input:[''],
            output:[''],
            op_type:'CorrelationMatrix',
            parameters:{
                'columns':[]
            }
        },
        'SplitData':{
            env:'Python',
            input:[''],
            output:[''],
            op_type:'SplitData',
            parameters:{
                'split_ratio':0.3
            }
        },
        'RM_Support_VectorMachine':{
            env:'Python',
            input:[''],
            output:[''],
            op_type:'RM_Support_VectorMachine',
            parameters:{
                'split_ratio':0.3
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