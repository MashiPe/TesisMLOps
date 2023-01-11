import { EditOutlined } from '@ant-design/icons';
import { ColGrid } from '@tremor/react';
import { Avatar, Button, Card, Divider, Input, Modal, Select, Space , Form, InputNumber} from 'antd'
import React, { Children, useState } from 'react'
import { IOperator } from '../../store/storetypes';
import DynamicGrid from '../DynamicGrid';
import styles from "./OperatorCard.module.scss";
import PythonIcon from "../../components/Icons/PythonIcon"
import { Option } from 'antd/es/mentions';
import InputMap from '../InputMap';
import InputList from '../InputList';

const {Meta} = Card;


export interface OperatorCardProps  {
    tittle:string,
    env: string,
    input: string[],
    op_type: string,
    output: string[],
    parameters: Map<string,any>,
}



export default function OperatorCard({tittle,env,input,op_type,output,parameters}:OperatorCardProps) {
    
    const envIcons = new Map<string,React.ReactNode>();

    envIcons.set('Python',<PythonIcon height={5} width={5} />)

    const [modalOpen,setModalOpen] = useState(false)

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
                <Form
                    labelCol={{ span:7 }}
                    labelAlign = 'left'
                    // wrapperCol={{ span: 25 }}
                    layout="horizontal"
                    onFieldsChange={ (_,all)=>{
                        console.log(all)
                    } }
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
                                style={{height:'fit-content', display:'table',width:'100%'}}>
                        {/* @ts-ignore*/}
                        <InputMap></InputMap>
                    </Form.Item>

                    <Form.Item 
                                name={'list1'}
                                label={'List map'} 
                                style={{height:'fit-content',width:'100%'}}>
                        {/* @ts-ignore*/}
                        <InputList />
                    </Form.Item>

                </Form>

            </div>    

    </Modal>
    </>
  )
}
