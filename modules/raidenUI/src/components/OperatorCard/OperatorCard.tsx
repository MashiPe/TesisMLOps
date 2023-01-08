import { EditOutlined } from '@ant-design/icons';
import { ColGrid } from '@tremor/react';
import { Avatar, Button, Card, Space } from 'antd'
import React, { Children } from 'react'
import { IOperator } from '../../store/storetypes';
import DynamicGrid from '../DynamicGrid';
import styles from "./OperatorCard.module.scss";
import PythonIcon from "../../components/Icons/PythonIcon"

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
  
    return (
  
    // <div>
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
                                
                        <Button className={styles.last} type='primary' icon={<EditOutlined/>}>Edit</Button>
                </div>
        </Card>
    // </div>
  )
}
