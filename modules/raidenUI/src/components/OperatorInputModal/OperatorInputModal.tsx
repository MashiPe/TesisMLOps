
import { Alert, Divider, Form, Input, InputNumber, Modal, Select } from 'antd'
import React from 'react'
import { useAppSelector } from '../../store/hooks'
import { selectOperatorDefinitionState } from '../../store/slices/OperatorDefinitionSlice/OperatorDefinitionSlice'
import { IOperator, OperatorDefinition } from '../../store/storetypes'
import InputMap from '../InputMap'
import InputList from '../InputList'
import { selectCurrentVersion, selectExperimentInfo } from '../../store/slices/CurrentExp/currentExpSlice'
import { selectExperimentList } from '../../store/slices/ExperimentsSlice/experimentsSlice'

export interface OperatorInputModalProps{
    modalOpen:boolean,
    handleOk: (values:any)=>void,
    handleCancel: ()=>void,
    opType:string,
    opDefinition: OperatorDefinition
    opValues: IOperator,
}

export default function OperatorInputModal({modalOpen,handleOk,handleCancel,opDefinition,opValues}:OperatorInputModalProps) {

    // const opDefinition = useAppSelector(selectOperatorDefinitionState)[opType]

    // console.log(op_type)

    const currentVersion = useAppSelector(selectCurrentVersion)
    const expInfo = useAppSelector(selectExperimentInfo) 

    const datasetInList =  expInfo.versions[currentVersion].datasetList.filter( (value)=>{
        return ! opValues.output.includes(value)
    } )

    const modelInList =  expInfo.versions[currentVersion].modelList.filter( (value)=>{
        return ! opValues.output.includes(value)
    } )

    const graphList =  expInfo.versions[currentVersion].graphList.filter( (value)=>{
        return ! opValues.output.includes(value)
    } )
    

    function formatValues(opValues: IOperator){

        const values = {} as {[key:string]:any}

        values['env']= opValues.env

        var datasetIni = 0
        var modelIni = 0
        
        opValues.input.map((value)=>{
            
            if ( datasetInList.includes(value)){
                values[`ind${datasetIni}`] = value
                datasetIni++
            }
            else if (modelInList.includes(value)){
                values[`inm${modelIni}`] = value
                modelIni++
            }
        })

        var outI = 0

        for (var i=0;i<opDefinition.outputDef.datasetOutput;i++){
            values[`outd${i}`] = opValues.output[outI]
            outI++
        }
        for (var i=0;i<opDefinition.outputDef.modelOutputs;i++){
            values[`outm${i}`] = opValues.output[outI]
            outI++
        }
        for (var i=0;i<opDefinition.outputDef.graphicsOutput;i++){
            values[`outg${i}`] = opValues.output[outI]
            outI++
        }

        Object.keys(opValues.parameters).map( (paramName)=>{
            values[paramName] = opValues.parameters[paramName]
        })

        console.log("Setting values for modal",opValues,values)

        return values
        
    }
    

    function renderForm( operatorDefinition: OperatorDefinition ){
        
        console.log("Definition: ",operatorDefinition)

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

            <Form.Item label={'Env:'} name={"env"}>
                <Select
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
                    <h2>Inputs</h2>,
                    <Divider dashed  ></Divider>
        )

        if ( opDefinition.inputDef.datasetInputs > 0 ){
            formElements.push(
                <h3>Datasets</h3>
            )

            for (let i = 0; i < opDefinition.inputDef.datasetInputs; i++) {
                
                formElements.push(
                        <Form.Item label={`Input dataset ${i}`} name={`ind${i}`}>
                            <Select
                                style={ {width:'100%'} }
                                placeholder='Select desired input'>
                            </Select>
                        </Form.Item>
                )
                
            }
        }

        if ( opDefinition.inputDef.modelInputs > 0 ){
            formElements.push(
                <h3>Models</h3>
            )

            for (let i = 0; i < opDefinition.inputDef.modelInputs; i++) {
                
                formElements.push(
                        <Form.Item label={`Input ${i}`} name={`inm${i}`}>
                            <Select
                                style={ {width:'100%'} }
                                placeholder='Select desired input'>
                            </Select>
                        </Form.Item>
                )
                
            }
        }

        formElements.push(
                    <h2>Outputs</h2>,
                    <Divider dashed  ></Divider>
        )

        
        if ( opDefinition.outputDef.datasetOutput > 0 ){
            formElements.push(
                <h3>Datasets</h3>
            )

            for (let i = 0; i < opDefinition.outputDef.datasetOutput; i++) {
                
                formElements.push(
                    <Form.Item label={`Output dataset ${i}`} name={`outd${i}`} >
                        <Input placeholder='Write name of output'></Input>
                    </Form.Item>
                )
                
            }
        }
            
        if ( opDefinition.outputDef.modelOutputs > 0 ){
            formElements.push(
                <h3>Models</h3>
            )

            for (let i = 0; i < opDefinition.outputDef.modelOutputs; i++) {
                
                formElements.push(
                    <Form.Item label={`Output model ${i}`} name={`outm${i}`} >
                        <Input placeholder='Write name of output'></Input>
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
                    <Form.Item label={`Output graphics ${i}`} name={`outg${i}`} >
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

    return (
            <Modal
                open={modalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
                width={'50%'}
                // style={{padding:'1%'}}
                >
                <div style={{maxHeight:'70vh', overflow:'auto',padding:'2.5%',marginTop:'5%'}}>
                    <Form
                        labelCol={{ span:7 }}
                        labelAlign = 'left'
                        // wrapperCol={{ span: 25 }}
                        layout="horizontal"
                        onFieldsChange={ (_,all)=>{
                            console.log(all)
                        } }
                        initialValues={formatValues(opValues)}
                        >
                            {
                                renderForm(opDefinition)
                            }
                    </Form>


                </div>    

        </Modal>
    )
}
