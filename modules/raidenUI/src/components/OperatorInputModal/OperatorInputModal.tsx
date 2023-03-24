
import { Alert, Divider, Form, Input, InputNumber, Modal, Select, FormProps} from 'antd'
import React, { useEffect, useState } from 'react'
import { useAppSelector } from '../../store/hooks'
import { selectOperatorDefinitionState } from '../../store/slices/OperatorDefinitionSlice/OperatorDefinitionSlice'
import { IOperator, OperatorDefinition } from '../../store/storetypes'
import InputMap from '../InputMap'
import InputList from '../InputList'
import { selectCurrentVersion, selectExperimentInfo } from '../../store/slices/CurrentExp/currentExpSlice'
import { selectExperimentList } from '../../store/slices/ExperimentsSlice/experimentsSlice'
import { selectDatasets } from '../../store/slices/DatasetSlice/datasetSlice'
import InputComplexMap from '../InputComplexMap'


export interface OperatorInputModalProps{
    modalOpen:boolean,
    handleOk: (values:any)=>void,
    handleCancel: ()=>void,
    opType:string
    opDefinition: OperatorDefinition
    opValues: IOperator
    opName: string
}

export default function OperatorInputModal({opName,modalOpen,handleOk,handleCancel,opType,opDefinition,opValues}:OperatorInputModalProps) {

    // const opDefinition = useAppSelector(selectOperatorDefinitionState)[opType]

    // console.log(op_type)

    // console.log("optype",opType)
    // console.log("opDefinition",opDefinition)
    // console.log("opValues",opValues)

    const [opValuesState,setOpValues] = useState(opValues)

    const currentVersion = useAppSelector(selectCurrentVersion)
    const expInfo = useAppSelector(selectExperimentInfo) 
    const globalDatasets = useAppSelector(selectDatasets)

    const [datasetInListState,setDatasetInList] = useState([''])    
    const [modelInListState,setModelInList] = useState([''])    
    const [graphListState,setGraphList] = useState([''])    


    useEffect( ()=>{
        setOpValues(opValues)
    },[opValues] )

    useEffect( ()=>{
        
        if (Object.keys(expInfo.versions).length >0 && currentVersion!==''){
            var datasetInList =  expInfo.versions[currentVersion].datasetList.filter( (value)=>{
                return ! opValues.output.includes(value)
            } )

            if (opType==='DefaultReader'){
                datasetInList = []
                Object.keys(globalDatasets).map((dataseKey)=>{

                    globalDatasets[dataseKey].versions.map( (datasetVersion)=>{
                        datasetInList.push(`${globalDatasets[dataseKey].name}:${datasetVersion.version_name}`)
                    } )

                })
            }

            const modelInList =  expInfo.versions[currentVersion].modelList.filter( (value)=>{
                return ! opValues.output.includes(value)
            } )

            const graphList =  expInfo.versions[currentVersion].graphList.filter( (value)=>{
                return ! opValues.output.includes(value)
            } )


            setDatasetInList(datasetInList)
            setModelInList(modelInList)
            setGraphList(graphList)
        }

    },[expInfo,currentVersion,globalDatasets,opType] )
    


    function formatValues(opValues: IOperator){

        const values = {} as {[key:string]:any}

        values['env']= opValues.env

        var inI = 0

        for (var i=0;i<opDefinition.inputDef.datasetInputs;i++){
            values[`in-d-${i}`] = opValues.input[inI]
            inI++
        }
        for (var i=0;i<opDefinition.inputDef.modelInputs;i++){
            values[`in-m-${i}`] = opValues.input[inI]
            inI++
        }
        var outI = 0

        for (var i=0;i<opDefinition.outputDef.datasetOutput;i++){
            values[`out-d-${i}`] = opValues.output[outI]
            outI++
        }
        for (var i=0;i<opDefinition.outputDef.modelOutputs;i++){
            values[`out-m-${i}`] = opValues.output[outI]
            outI++
        }
        for (var i=0;i<opDefinition.outputDef.graphicsOutput;i++){
            values[`out-g-${i}`] = opValues.output[outI]
            outI++
        }

        Object.keys(opValues.parameters).map( (paramName)=>{
            values[paramName] = opValues.parameters[paramName]
        })

        return values
        
    }
    

    function renderForm( operatorDefinition: OperatorDefinition ){

        const formElements : React.ReactNode[]= []

        const numInpus = operatorDefinition.inputDef.modelInputs + operatorDefinition.inputDef.datasetInputs

        if ( numInpus <=0  ) {
            formElements.push(
                <Alert
                    type='error'
                    description='Wrong input description'
                />
            )
            return formElements
        }

        const numOuts = operatorDefinition.outputDef.datasetOutput + 
                        operatorDefinition.outputDef.graphicsOutput +
                        operatorDefinition.outputDef.modelOutputs

        if ( numOuts <=0  ) {
            formElements.push(
                <Alert
                    type='error'
                    description='Wrong out description'
                />
            )
            return formElements
        }

        formElements.push(

            <Form.Item key={'env-form-item'} label={'Env:'} name={"env"}>
                <Select
                    key='env-selector'
                    style={{width:'50%'}}
                    options={[
                        {
                            value: 'Python',
                            label: 'Python',
                        }
                    ]}
                    // value={'name'}
                    >
                </Select>
            </Form.Item>

        )

        formElements.push(
                    <h2 key={'input-title'} >Inputs</h2>,
                    <Divider dashed  key={'input-divider'}></Divider>
        )

        if ( opDefinition.inputDef.datasetInputs > 0 ){
            formElements.push(
                <h3 key={'dataset-title'} >Datasets</h3>
            )

            for (let i = 0; i < opDefinition.inputDef.datasetInputs; i++) {
                formElements.push(
                        <Form.Item key={`input-dataset-item-${i}`} label={`Input dataset ${i}`} name={`in-d-${i}`}>
                            <Select
                                key={`input-dataset-select-${i}`}
                                style={ {width:'100%'} }
                                placeholder='Select desired input'
                                options={ datasetInListState.map( (inputName)=>{
                                    return {
                                        value: inputName,
                                        label: inputName
                                     }
                                } ) } 
                                >   
                            </Select>
                        </Form.Item>
                )
                
            }
        }

        if ( opDefinition.inputDef.modelInputs > 0 ){
            formElements.push(
                <h3 key={'models-in-title'}>Models</h3>
            )

            for (let i = 0; i < opDefinition.inputDef.modelInputs; i++) {
                
                formElements.push(
                        <Form.Item key={`input-model-item-${i}`} label={`Input ${i}`} name={`in-m-${i}`}>
                            <Select
                                key={`input-model-select-${i}`}
                                style={ {width:'100%'} }
                                placeholder='Select desired input'
                                options={ modelInListState.map( (inputName)=>{
                                    return {
                                        value: inputName,
                                        label: inputName
                                     }
                                } ) } 
                                >   
                            </Select>
                        </Form.Item>
                )
                
            }
        }

        formElements.push(
                    <h2 key={'output-title'}>Outputs</h2>,
                    <Divider key={'out-divider'} dashed  ></Divider>
        )

        
        if ( opDefinition.outputDef.datasetOutput > 0 ){
            formElements.push(
                <h3 key={'dataset-out-title'} >Datasets</h3>
            )

            for (let i = 0; i < opDefinition.outputDef.datasetOutput; i++) {
                
                formElements.push(
                    <Form.Item key={`out-dataset-item-${i}`} label={`Output dataset ${i}`} name={`out-d-${i}`} >
                        <Input key={`out-dataset-input-${i}`}
                            placeholder='Write name of output'></Input>
                    </Form.Item>
                )
                
            }
        }
            
        if ( opDefinition.outputDef.modelOutputs > 0 ){
            formElements.push(
                <h3 key={`out-model-title`}>Models</h3>
            )

            for (let i = 0; i < opDefinition.outputDef.modelOutputs; i++) {
                
                formElements.push(
                    <Form.Item key={`out-model-item-${i}`} label={`Output model ${i}`} name={`out-m-${i}`} >
                        <Input key={`out-model-input-${i}`} placeholder='Write name of output'></Input>
                    </Form.Item>
                )
                
            }
        }

        if ( opDefinition.outputDef.graphicsOutput > 0 ){
            formElements.push(
                <h3>Graphics</h3>
            )

            for (let i = 0; i < opDefinition.outputDef.graphicsOutput; i++) {
                
                formElements.push(
                    <Form.Item label={`Output graphics ${i}`} name={`out-g-${i}`} >
                        <Input placeholder='Write name of output'></Input>
                    </Form.Item>
                )
                
            }
        }

        if (opDefinition.paramsDef.length > 0){
            formElements.push(
                        <h2>Params</h2>,
                        <Divider dashed  ></Divider>)
            
            opDefinition.paramsDef.map( (paramDef) =>{
                let newEl: React.ReactNode

                switch(paramDef.type){
                    
                    case 'string':{
                        newEl = <Form.Item label={paramDef.name} name={paramDef.name}>
                            <Input placeholder='Write string value'></Input>
                        </Form.Item>
                        break
                    }

                    case 'number':{
                        newEl = <Form.Item label={paramDef.name} name={paramDef.name}>
                            <InputNumber placeholder='Write number value'></InputNumber>
                        </Form.Item>
                        break
                    }

                    case 'map':{
                        newEl = <Form.Item 
                                    name={paramDef.name}
                                    label={paramDef.name} 
                                    style={{height:'fit-content', display:'table',width:'100%'}}>
                            {/* @ts-ignore*/}
                            <InputMap></InputMap>
                        </Form.Item>
                        break
                    }

                    case 'complexMap':{
                        newEl = <Form.Item 
                                    name={paramDef.name}
                                    label={paramDef.name} 
                                    style={{height:'fit-content', display:'table',width:'100%'}}>
                            {/* @ts-ignore*/}
                            <InputComplexMap/>
                        </Form.Item>
                        break
                    }
                    
                    case 'list':{
                        newEl = <Form.Item 
                                    name={paramDef.name}
                                    label={paramDef.name} 
                                    style={{height:'fit-content',width:'100%'}}>
                            {/* @ts-ignore*/}
                            <InputList />
                        </Form.Item>
                    }
                }

                formElements.push(newEl) 
            } )
        }

        return formElements
    }

    const handleFieldsChange: FormProps['onFieldsChange'] = (changedFields,allFields)=>{

        console.log("HandleFieldsChange",allFields)
        
        const newOpValues = {
            env:'',
            input:[],
            op_type:opType,
            output:[],
            parameters:{},
            op_name:'' 
        }as IOperator

        allFields.map((field)=>{
            
            var fieldName = field.name.toString()
            
            const inRegex = new RegExp('in-')
            const outRegex = new RegExp('out-')

            if (inRegex.test(fieldName)){
                
                var new_value = field.value as string

                if (opType == 'DefaultReader')
                    new_value = new_value.split(":")[1]

                newOpValues['input'] = [...newOpValues['input'],new_value]
                return
            }

            if (outRegex.test(fieldName)){
                newOpValues['output'] = [...newOpValues['output'],field.value]
                return
            }
            
            if (fieldName == 'env'){
                newOpValues[fieldName] = field.value
                return
            }

            newOpValues.parameters[fieldName] = field.value

        } )

        console.log("NewState",newOpValues)
        setOpValues(newOpValues)
    }

    return (
            <Modal
                open={modalOpen}
                onOk={()=>{
                    // console.log("Sending new values",opValuesState)
                    handleOk(opValuesState)
                    setOpValues({
                        env:'Python',
                        input:[],
                        op_type:'',
                        output:[],
                        parameters:{},
                        op_name:''
                    }as IOperator)
                }}
                onCancel={()=>{
                    handleCancel()
                    setOpValues({
                        env:'Python',
                        input:[],
                        op_type:'',
                        output:[],
                        parameters:{},
                        op_name:''
                    }as IOperator)
                }}
                width={'75%'}
                // style={{padding:'1%'}}
                >
                <h1>{opType}</h1>
                <h2>{opName}</h2>
                <div style={{maxHeight:'70vh', overflow:'auto',padding:'2.5%',marginTop:'5%'}}>
                    <Form
                        labelCol={{ span:7 }}
                        labelAlign = 'left'
                        // wrapperCol={{ span: 25 }}
                        layout="horizontal"
                        onFieldsChange={handleFieldsChange}
                        initialValues={formatValues(opValuesState)}
                        >
                            {
                                renderForm(opDefinition)
                            }
                    </Form>


                </div>    

        </Modal>
    )
}
