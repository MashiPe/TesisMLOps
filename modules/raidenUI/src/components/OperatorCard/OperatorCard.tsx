import { EditOutlined } from '@ant-design/icons';
import { ColGrid } from '@tremor/react';
import { Avatar, Button, Card, Divider, Input, Modal, Select, Space , Form, InputNumber, Alert} from 'antd'
import React, { Children, useState } from 'react'
import { IOperator, OperatorDefinition } from '../../store/storetypes';
import DynamicGrid from '../DynamicGrid';
import styles from "./OperatorCard.module.scss";
import PythonIcon from "../../components/Icons/PythonIcon"
import { Option } from 'antd/es/mentions';
import InputMap from '../InputMap';
import InputList from '../InputList';
import { useAppSelector } from '../../store/hooks';
import { selectOperatorDefinitionState } from '../../store/slices/OperatorDefinitionSlice/OperatorDefinitionSlice';

const {Meta} = Card;


export interface OperatorCardProps  {
    tittle:string,
    env: string,
    input: string[],
    op_type: string,
    output: string[],
    parameters: Map<string,any>,
}

// const test = {'hello':'world'}

const envIcons = new Map<string,React.ReactNode>();

envIcons.set('Python',<PythonIcon height={5} width={5} />)

export default function OperatorCard({tittle,env,input,op_type,output,parameters}:OperatorCardProps) {

    const [modalOpen,setModalOpen] = useState(false)

    
    const opDefinition = useAppSelector(selectOperatorDefinitionState)[op_type]

    // console.log(op_type)

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
                        <Form.Item label={`Input ${i}`} name={`in${i}`}>
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

    function launchInput(){
        setModalOpen(true)
    }

    function handleOk(values:any){
        console.log("Updating Info")
        console.log(values)
        setModalOpen(false)
    }

    function handleCance(){
        console.log("Reverting updates")
        setModalOpen(false)
    }
  
    return (
  
    <>
        <Card 
            // bordered={false} 
            // headStyle={{borderBottom:0}} 
            bodyStyle={{overflow:'auto',height:'15vh',padding:'2%'} }
            style={{minHeight:'15vh' }}
            // extra= {<Button type='primary' icon={<CaretRightOutlined/>} >Abrir</Button>}
            >
                <div className={styles.content}>
                        {/* asdasd */}
                        <Meta
                            // className={}
                            style={{ whiteSpace:'break-spaces'}}
                            avatar={
                                <Avatar style={{backgroundColor:'#1E2019'}} >
                                    {

                                        envIcons.get(env)
                                    }

                                </Avatar>
                            }   
                            title={tittle}
                            // description="This is the description"
                        />
                            
                        <div className={styles.params}>
                            <ColGrid numColsMd={2}>
                                {
                                    <>
                                        {
                                            input.map( (value,index)=>{
                                                return (
                                                    <h3 key={`Input ${index}`} >{`Input ${index} : ${value}`}</h3>
                                                )
                                            })
                                        }
                                        {
                                            output.map( (value,index)=>{
                                                return (
                                                    <h3 key={`Output ${index}`} >{`Output ${index} : ${value}`}</h3>
                                                )
                                            })
                                        }
                                        {
                                            Array.from(parameters.keys()).map( (key)=>{
                                                return (
                                                    <h3 key={`${key}:${parameters.get(key)}`} >{`${key} : ${parameters.get(key)}`}</h3>
                                                )
                                            })
                                        }
                                    </>
                                }
                            </ColGrid>
                        </div>                                
                                
                        <Button 
                            className={styles.last} 
                            type='primary' 
                            icon={<EditOutlined/>}
                            onClick={launchInput}
                        >
                            Edit
                        </Button>
                </div>

            </Card>

        <Modal
            open={modalOpen}
            onOk={handleOk}
            onCancel={handleCance}
            width={'50%'}
            // style={{padding:'1%'}}
            >
            <div style={{maxHeight:'70vh', overflow:'auto',padding:'2.5%',marginTop:'5%'}}>
                {/* <Form
                    labelCol={{ span:7 }}
                    labelAlign = 'left'
                    // wrapperCol={{ span: 25 }}
                    layout="horizontal"
                    onFieldsChange={ (_,all)=>{
                        console.log(all)
                    } }
                    initialValues = {
                        {
                            env: 'Python',
                            in1: 'Dataset1',
                            out1: 'out1',
                            str1: 'stringField',
                            num1: 10,
                            list1: [1,2,3,4],
                            map1: { 'testKey':'testValue' }

                        }
                    }
                    >
                    
                    <Form.Item label={'env:'} name={"env"}>
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

                    <h2>Inputs</h2>
                    <Divider dashed  ></Divider>
                    
                    <Form.Item label={'Input 1'} name={"in1"}>
                        <Select
                            style={ {width:'100%'} }
                            placeholder='Select desired input'>
                        </Select>
                    </Form.Item>

                    <h2>Outputs</h2>
                    <Divider dashed  ></Divider>
                    
                    <Form.Item label={'Output 1'} name={"out1"} >
                        <Input placeholder='Write name of output'></Input>
                    </Form.Item>

                    <h2>Parameters</h2>
                    <Divider dashed  ></Divider>

                    <Form.Item label={'Param 1 str'} name={"str1"}>
                        <Input placeholder='Write string value'></Input>
                    </Form.Item>

                    <Form.Item label={'Param 2 number'} name={"num1"}>
                        <InputNumber placeholder='Write number value'></InputNumber>
                    </Form.Item>

                    <Form.Item 
                                name={'map1'}
                                label={'Param map'} 
                                style={{height:'fit-content', display:'table',width:'100%'}}> */}
                        {/* @ts-ignore*/}
                        {/* <InputMap></InputMap>
                    </Form.Item>

                    <Form.Item 
                                name={'list1'}
                                label={'List'} 
                                style={{height:'fit-content',width:'100%'}}> */}
                        {/* @ts-ignore*/}
                        {/* <InputList />
                    </Form.Item>

                </Form> */}
                
                <Form
                    labelCol={{ span:7 }}
                    labelAlign = 'left'
                    // wrapperCol={{ span: 25 }}
                    layout="horizontal"
                    onFieldsChange={ (_,all)=>{
                        console.log(all)
                    } }
                    >
                        {
                            renderForm(opDefinition)
                        }
                </Form>


            </div>    

    </Modal>
    </>
  )
}
