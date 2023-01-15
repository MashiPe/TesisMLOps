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
import OperatorInputModal from '../OperatorInputModal';

const {Meta} = Card;


export interface OperatorCardProps  {
    tittle:string,
    env: string,
    input: string[],
    op_type: string,
    output: string[],
    parameters: {[key:string]:any},
}

// const test = {'hello':'world'}

const envIcons = new Map<string,React.ReactNode>();

envIcons.set('Python',<PythonIcon height={5} width={5} />)

export default function OperatorCard({tittle,env,input,op_type,output,parameters}:OperatorCardProps) {

    const [modalOpen,setModalOpen] = useState(false)

    const opDefinition = useAppSelector(selectOperatorDefinitionState)[op_type]

    const opValues = {
        env:env,
        input: input,
        output: output,
        op_type: op_type,
        parameters: parameters
    } as IOperator 

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
                                            Array.from(Object.keys(parameters)).map( (key)=>{

                                                var val = parameters[key]

                                                if (typeof(val)=='object'){
                                                    val = JSON.stringify(val)
                                                }

                                                return (
                                                    <h3 key={`${key}:${parameters[key]}`} >{`${key} : ${val}`}</h3>
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

        {/* <Modal
            open={modalOpen}
            onOk={handleOk}
            onCancel={handleCance}
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
                    >
                        {
                            renderForm(opDefinition)
                        }
                </Form>


            </div>    

    </Modal> */}
        
        <OperatorInputModal 
            modalOpen={modalOpen} 
            handleCancel={handleCance} 
            handleOk={handleOk} 
            opDefinition={opDefinition}
            opValues={opValues}
            opType={op_type} />
    </>
  )
}
