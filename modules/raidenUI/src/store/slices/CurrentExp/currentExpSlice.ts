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
        descriptors: new Map(),
        io_metadata: new Map(),
        link: 'http://example.com/1',
        name: 'V1',
        operators: new Map(),
        order_list:[ ['read_op','encode_op'] ]
    } as IVersion

const read_op_params = new Map()
// read_op_params.set('dataset', 'dataset1')
read_op_params.set('limit', 100)

v1.operators.set('read_op',{
        env : 'Python',
        input: ['In1'],
        op_type: 'DefaultReader',
        output: ['Out1'],
        parameters: read_op_params,
    } as IOperator)

const encode_op = new Map()
encode_op.set('limit', 100)
encode_op.set('p1', 1234)

v1.operators.set('encode_op',{
        env : 'Python',
        input: ['In3','In4'],
        op_type: 'EncodeColumn',
        output: ['Out3','Out4'],
        parameters: encode_op
    } as IOperator)

const currentExp = {
    link: 'http://example.com/1',
    name: 'Mock experiment 1',
    description: 'Just a description',
    versions: new Map<string,IVersion>()
} as IExperiment

currentExp.versions.set('V1',v1)

const v2 ={
        link:'http://example.com/version/1',
        name:'V1',
        operators:new Map(),
        descriptors:new Map(),
        io_metadata: new Map(),
        order_list: []
    } as IVersion

currentExp.versions.set('V2',v2)


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