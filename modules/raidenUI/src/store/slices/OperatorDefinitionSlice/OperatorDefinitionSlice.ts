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
                    "PCA":{
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
                                name:'components',
                                type:'number'
                            },
                        ]
                    } as OperatorDefinition,
                    "Kmeans":{
                        inputDef: { 
                            datasetInputs: 1,
                            modelInputs: 0
                        }, 
                        outputDef: {
                            datasetOutput:0,
                            modelOutputs: 0,
                            graphicsOutput:0
                        },
                        paramsDef:[
                            {
                                name:'k',
                                type:'number'
                            },
                            {
                                name:"version",
                                type:'string'
                            },
                        ]
                    } as OperatorDefinition,
                    "Groupby":{
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
                                name:'groupby',
                                type:'list'
                            },
                            {
                                name:"aggcolumn",
                                type:'string'
                            },
                            {
                                name:"agg",
                                type:'string'
                            }
                        ]
                    } as OperatorDefinition,
                    "Elbow":{
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
                                name:'kmin',
                                type:'number'
                            },
                            {
                                name:"kmax",
                                type:'number'
                            },
                            {
                                name:"colums",
                                type:'list'
                            }
                        ]
                    } as OperatorDefinition,
                    "Density":{
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
                            },
                            {
                                name:"title",
                                type:'string'
                            }
                        ]
                    } as OperatorDefinition,
                    "Plot_likert":{
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
                    "DropColumns":{
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
                                name:'columns',
                                type:'list'
                            }
                        ]
                    } as OperatorDefinition,
                    "Pivot":{
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
                        ]
                    } as OperatorDefinition,
                    "BasicStatistics":{
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
                        ]
                    } as OperatorDefinition,
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
                            // {
                            //     name:'columns',
                            //     type:'list'
                            // }
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
                            datasetInputs:1,
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
                operators: ['ReformatData','SplitData','DropColumns']
            } as subGroup,{
                title:'Data Anlysis',
                operators: ["BasicStatistics","Plot_likert","Density","Pivot"]
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
            },
            op_name:''
        }as IOperator,
        'DefaultReader': {
            env:'Python',
            input:[''],
            output:[''],
            op_type:'DefaultReader',
            parameters:{
            }
            ,op_name:''
        }as IOperator,
        'ReformatData':{
            env:'Python',
            input:[''],
            output:[''],
            op_type:'ReformatData',
            parameters:{
                'columns':{}
            },
            op_name:''
        },
        'ConfusionMatrix':{
            env:'Python',
            input:[''],
            output:[''],
            op_type:'ConfussionMatrix',
            parameters:{
            }
            ,op_name:''
        },
        'CorrelationMatrix':{
            env:'Python',
            input:[''],
            output:[''],
            op_type:'CorrelationMatrix',
            parameters:{
                // 'columns':[]
            }
            ,op_name:''
        },
        'SplitData':{
            env:'Python',
            input:[''],
            output:[''],
            op_type:'SplitData',
            parameters:{
                'split_ratio':0.3
            }
            ,op_name:''
        },
        'Density':{
            env:'Python',
            input:[''],
            output:[''],
            op_type:'Density',
            parameters:{
                'columns':[]
            }
            ,op_name:''
        },
        'Plot_likert':{
            env:'Python',
            input:[''],
            output:[''],
            op_type:'Plot_likert',
            parameters:{
                'columns':[]
            }
            ,op_name:''
        },
        'DropColumns':{
            env:'Python',
            input:[''],
            output:[''],
            op_type:'DropColumns',
            parameters:{
                'columns':[]
            }
            ,op_name:''
        },
        'Pivot':{
            env:'Python',
            input:[''],
            output:[''],
            op_type:'Pivot',
            parameters:{
            }
            ,op_name:''
        },
        'BasicStatistics':{
            env:'Python',
            input:[''],
            output:[''],
            op_type:'BasicStatistics',
            parameters:{
            }
            ,op_name:''
        },
        'RM_Support_Vector_Machine':{
            env:'Python',
            input:[''],
            output:[''],
            op_type:'RM_Support_VectorMachine',
            parameters:{
                'kernel':''
            }
            ,op_name:''
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