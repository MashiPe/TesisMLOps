import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import Operation from "antd/es/transfer/operation"
import { RootState } from "../../store"
import { IExperiment, IOperator, IVersion } from "../../storetypes" 

interface CurrentExpState{
    workingVersion:string,
    exp: IExperiment
}

var operatorsV = {};

const v1 = {
        descriptors: {},
        io_metadata: {},
        link: 'http://example.com/1',
        name: 'V1',
        operators: {},
        order_list:[ ['read_op','encode_op'] ],
        datasetList:['Dataset1','Dataset2'],
        graphList:[],
        modelList:[],
    } as IVersion

const read_op_params = {
    'limit': 100
}
// read_op_params.set('dataset', 'dataset1')

v1.operators['read_op']={
        env : 'Python',
        input: ['In1'],
        op_type: 'DefaultReader',
        output: ['Dataset1'],
        parameters: read_op_params,
    } as IOperator

const encode_op = {
    // 'limit': 100,
    'Class': 'testClass',
    'Encode Map': {'holi':"mundo"},
    // 'list':['1','1','1']
}

v1.operators['encode_op']={
        env : 'Python',
        input: ['Dataset1'],
        op_type: 'EncodeColumn',
        output: ['Dataset2'],
        parameters: encode_op
    } as IOperator

const currentExp = {
    link: 'http://example.com/1',
    name: 'Mock experiment 1',
    description: 'Just a description',
    versions: {}
} as IExperiment

currentExp.versions['V1']=v1

const v2 ={
        link:'http://example.com/version/2',
        name:'V2',
        operators:{},
        descriptors:{},
        io_metadata: {},
        order_list: [],
        datasetList:[],
        graphList:[],
        modelList:[],
    } as IVersion

currentExp.versions['V2']=v2


const initialState : CurrentExpState = {

    workingVersion: 'V1',
    exp: currentExp
    // link: 'soyUnLink',
    // name: 'TestExp',
    // description: 'SoyUnaDescripcion uwu :3',
    // operators: {},
    // order_list: [],
    // descriptors: {},
    // io_metadata: {}
}


export const currentExpSlice = createSlice({
    name: 'currentExp',
    initialState,
    reducers:{
        setCurrentVersion: (state,action:PayloadAction<string>)=>{
            state.workingVersion=action.payload
        },
        // setCurrentExpName: (state,action:PayloadAction<string>)=>{
        //     state.name=action.payload
        // },
        // setCurrentExpDescription: (state,action:PayloadAction<string>)=>{
        //     state.description=action.payload
        // },
        // putOperator:(state,action:PayloadAction< {op_name:string,operator:IOperator} >)=>{

        //     var currentState = state.operators
        //     currentState[action.payload.op_name] = action.payload.operator

        //     var newOrderEntries:string[][] = []
            
        //     for (let key in state.operators){
        //         const found = action.payload.operator.input.some( (in_el) => state.operators[key].output.includes(in_el) )
                
        //         if (found){
        //             newOrderEntries.push([key,action.payload.op_name])
        //         }

        //     }
            
        //     state.operators = currentState
        //     state.order_list= [...state.order_list,...newOrderEntries]

        // },
        
    }
})

export const {setCurrentVersion} = currentExpSlice.actions

export const selectCurrentVersion = (state: RootState)=> state.currentExp.workingVersion
export const selectExperimentInfo = (state: RootState)=> state.currentExp.exp

// export const selectCurrentExpName = (state: RootState)=> state.currentExp.name
// export const selectCurrentExpDescription = (state: RootState)=> state.currentExp.description
// export const selectCurrentExpOperators= (state: RootState)=> state.currentExp.operators

export default currentExpSlice.reducer;