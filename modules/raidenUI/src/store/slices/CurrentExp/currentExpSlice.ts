import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { RootState } from "../../store"


export interface CurrentExperiment{
    link:string
}

const initialState : CurrentExperiment = {
    link: ''
}


export const currentExpSlice = createSlice({
    name: 'currentExp',
    initialState,
    reducers:{
        setCurrentExp: (state,action:PayloadAction<string>)=>{
            state.link=action.payload
        }
    }
})

export const {setCurrentExp} = currentExpSlice.actions

export const selectCurrentExpLink = (state: RootState)=> state.currentExp.link

export default currentExpSlice.reducer;