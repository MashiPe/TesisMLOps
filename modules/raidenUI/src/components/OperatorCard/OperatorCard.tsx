import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
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
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { selectOperatorDefinitionState } from '../../store/slices/OperatorDefinitionSlice/OperatorDefinitionSlice';
import OperatorInputModal from '../OperatorInputModal';
import { removeOperator, selectCurrentVersionInfo, selectExperimentInfo, setOperator } from '../../store/slices/CurrentExp/currentExpSlice';
import { useDeleteOperatorMutation, useUpdateOperatorMutation } from '../../store/api/flaskslice';

const {Meta} = Card;


export interface OperatorCardProps  {
    op_name:string,
    // env: string,
    // input: string[],
    // op_type: string,
    // output: string[],
    // parameters: {[key:string]:any},
}

// const test = {'hello':'world'}

const envIcons = new Map<string,React.ReactNode>();

envIcons.set('Python',<PythonIcon height={5} width={5} />)

export default function OperatorCard({op_name}:OperatorCardProps) {
    

    const currentVersion = useAppSelector(selectCurrentVersionInfo)
    // const exp = useAppSelector(selectExperimentInfo)

    const op_info = currentVersion.operators[op_name]
    const {env,input,output,parameters,op_type} = currentVersion.operators[op_name]

    const [modalOpen,setModalOpen] = useState(false)

    const opDefinition = useAppSelector(selectOperatorDefinitionState)[op_type]
    const dispatch = useAppDispatch()
    const [sendOperatorUpdate ] = useUpdateOperatorMutation()
    const [deleteOperator ] = useDeleteOperatorMutation()

    // const opValues = {
    //     env:env,
    //     input: input,
    //     output: output,
    //     op_type: op_type,
    //     parameters: parameters,
    // } as IOperator 

    function launchInput(){
        console.log("op_info\n",op_info)
        setModalOpen(true)
    }

    function handleDeleteOperator(){
        deleteOperator({ version_iri:currentVersion.link
                        ,operator:{name:op_name,type:op_type}}).unwrap()
            .then( (updatedOperator) =>{
                dispatch(removeOperator({op_name:op_name}))
        })

    }

    function handleOk(values:IOperator){

        var input_def: string[] = []
        var out_def: string[] = []

        input_def = input_def.concat(Array(opDefinition.inputDef.datasetInputs).fill('dataset'))
        input_def = input_def.concat(Array(opDefinition.inputDef.modelInputs).fill('model'))

        out_def= out_def.concat(Array(opDefinition.outputDef.datasetOutput).fill('dataset'))
        out_def=out_def.concat(Array(opDefinition.outputDef.modelOutputs).fill('model'))
        out_def=out_def.concat(Array(opDefinition.outputDef.graphicsOutput).fill('graph'))
            
        sendOperatorUpdate( { version_iri:currentVersion.link
                        ,operator:{...values,name:op_name,type:op_type,input_type:input_def,output_type:out_def}}).unwrap()
            .then( (updatedOperator) =>{
                dispatch(setOperator({op_name:op_name,operator:updatedOperator}))
                setModalOpen(false)

        })
    }

    function handleCance(){
        // console.log("Reverting updates")
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
                                <Avatar style={{
                                    // backgroundColor:'#1E2019'
                                    }} >
                                    {

                                        envIcons.get(env)
                                    }

                                </Avatar>
                            }   
                            title={op_name}
                            description={op_type}
                        />
                            
                        <div className={styles.params}>
                            <ColGrid numColsMd={2}>
                                {
                                    <>
                                        {
                                            input.map( (value,index)=>{
                                                // console.log("input",op_name,value)
                                                return (
                                                    <p key={`Input ${index}`} >{`Input ${index} : ${value}`}</p>
                                                )
                                            })
                                        }
                                        {
                                            output.map( (value,index)=>{
                                                return (
                                                    <p key={`Output ${index}`} >{`Output ${index} : ${value}`}</p>
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
                                                    <p key={`${key}:${parameters[key]}`} >{`${key} : ${val}`}</p>
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

                        <Button 
                            className={styles.last} 
                            type='primary' 
                            icon={<DeleteOutlined/>}
                            onClick={()=>{
                                handleDeleteOperator()
                            }}
                        >
                            Delete
                        </Button>
                </div>

            </Card>
        {
            modalOpen ? 
                <OperatorInputModal 
                    opName={op_name}
                    modalOpen={modalOpen} 
                    handleCancel={handleCance} 
                    handleOk={handleOk} 
                    opDefinition={opDefinition}
                    opValues={op_info}
                    opType={op_type} /> :
                    <></>
        }
    </>
  )
}
