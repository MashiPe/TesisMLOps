import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import Operation from "antd/es/transfer/operation"
import { RootState } from "../../store"
import { IExperiment, IOperator, IVersion } from "../../storetypes" 

import {globalDefinitions} from "../OperatorDefinitionSlice/OperatorDefinitionSlice"

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


function makeList(expVersion: IVersion){

    const datasetList:string[]= []
    const modelList :string[]= []
    const graphicsList :string[]= []

    Object.keys(expVersion.operators).map((operatorKey)=>{

        const operator = expVersion.operators[operatorKey]

        const opDefinition = globalDefinitions[operator.op_type]

        var outputIndex = 0

        for (let i = 0; i < opDefinition.outputDef.datasetOutput; i++) {
            datasetList.push(operator.output[outputIndex])
            outputIndex++
        }
        for (let i = 0; i < opDefinition.outputDef.modelOutputs; i++) {
            modelList.push(operator.output[outputIndex])
            outputIndex++
        }
        for (let i = 0; i < opDefinition.outputDef.graphicsOutput; i++) {
            graphicsList.push(operator.output[outputIndex])
            outputIndex++
        }

    })
    

    return {datasetList,modelList,graphicsList}
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
        setOperator:(state,action:PayloadAction< {op_name:string,operator:IOperator} >)=>{

            const opName = action.payload.op_name
            const opInfo = action.payload.operator

            const currentVersion = state.workingVersion
            const versionObj = state.exp.versions[currentVersion]
            
            const auxOperators = Array.from(Object.keys(versionObj.operators)).filter( (op)=>{
                return op!=opName
            })
            
            const oldInfo = versionObj.operators[opName]

            if (oldInfo != undefined){
                auxOperators.map( (op)=>{
                    
                    oldInfo.output.map((out_name,index)=>{
                        if (versionObj.operators[op].input.includes(out_name)){
                            const in_index = versionObj.operators[op].input.indexOf(out_name)
                            
                            state.exp.versions[currentVersion].operators[op].input[in_index] = opInfo.output[index]

                        }
                    })
                } )
            }

            const auxOrderList = versionObj.order_list.filter((value)=>{
                return  value[1]!=opName
            })

            var dependencyList:string[] = []
            
            opInfo.input.map( (in_name)=>{
                
                Object.keys(versionObj.operators).forEach( (opKey)=>{
                    if (opKey!=opName){

                        if (versionObj.operators[opKey].output.includes(in_name)){
                            dependencyList.push(opKey)
                        }
                    }
                } )
                
            } )

            var dependencyList = dependencyList.filter(function(elem, index, self) {
                return index === self.indexOf(elem);
            })
                
            
            const orderItems = dependencyList.map((dep)=>{
                return [dep,opName]
            })
            

            state.exp.versions[currentVersion].operators[opName] = opInfo
            state.exp.versions[currentVersion].order_list=[...auxOrderList,...orderItems]

            // newInfo.operators[opName]= opInfo 

            const {datasetList,graphicsList,modelList} = makeList(state.exp.versions[currentVersion]) 
            // newInfo.datasetList = datasetList
            // newInfo.modelList = modelList
            // newInfo.graphList = graphicsList

            state.exp.versions[currentVersion].datasetList = datasetList
            state.exp.versions[currentVersion].modelList = modelList
            state.exp.versions[currentVersion].graphList = graphicsList


        } 
        //     state.operators = currentState
        //     state.order_list= [...state.order_list,...newOrderEntries]

        // },
        
    }
})

export const {setCurrentVersion,setOperator} = currentExpSlice.actions

export const selectCurrentVersion = (state: RootState)=> state.currentExp.workingVersion
export const selectExperimentInfo = (state: RootState)=> state.currentExp.exp
export const selectCurrentVersionInfo = (state: RootState)=>{
    const currentVersion = state.currentExp.workingVersion
    const currentVersionInfo = state.currentExp.exp.versions[currentVersion]

    return currentVersionInfo
}

// export const selectCurrentExpName = (state: RootState)=> state.currentExp.name
// export const selectCurrentExpDescription = (state: RootState)=> state.currentExp.description
// export const selectCurrentExpOperators= (state: RootState)=> state.currentExp.operators

export default currentExpSlice.reducer;