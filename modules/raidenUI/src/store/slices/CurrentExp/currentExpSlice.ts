import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import Operation from "antd/es/transfer/operation"
import { RootState } from "../../store"
import { IExperiment, IOperator } from "../../storetypes" 

const initialState : IExperiment = {
    link: 'soyUnLink',
    name: 'TestExp',
    description: 'SoyUnaDescripcion uwu :3',
    operators: {},
    order_list: [],
    descriptors: {},
    io_metadata: {}
}


export const currentExpSlice = createSlice({
    name: 'currentExp',
    initialState,
    reducers:{
        setCurrentExpLink: (state,action:PayloadAction<string>)=>{
            state.link=action.payload
        },
        setCurrentExpName: (state,action:PayloadAction<string>)=>{
            state.name=action.payload
        },
        setCurrentExpDescription: (state,action:PayloadAction<string>)=>{
            state.description=action.payload
        },
        putOperator:(state,action:PayloadAction< {op_name:string,operator:IOperator} >)=>{

            var currentState = state.operators
            currentState[action.payload.op_name] = action.payload.operator

            var newOrderEntries:string[][] = []
            
            for (let key in state.operators){
                const found = action.payload.operator.input.some( (in_el) => state.operators[key].output.includes(in_el) )
                
                if (found){
                    newOrderEntries.push([key,action.payload.op_name])
                }

            }
            
            state.operators = currentState
            state.order_list= [...state.order_list,...newOrderEntries]

        },
        
    }
})

export const {setCurrentExpDescription,setCurrentExpLink,setCurrentExpName,putOperator} = currentExpSlice.actions

export const selectCurrentExpLink = (state: RootState)=> state.currentExp.link
export const selectCurrentExpName = (state: RootState)=> state.currentExp.name
export const selectCurrentExpDescription = (state: RootState)=> state.currentExp.description
export const selectCurrentExpOperators= (state: RootState)=> state.currentExp.operators

export default currentExpSlice.reducer;