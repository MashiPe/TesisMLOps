import { Text,Metric, Title } from '@tremor/react'
import React from 'react'
import style from "./ExperimentCard.module.scss";
import {CaretRightOutlined, RightOutlined} from "@ant-design/icons";

import {Button, Card } from "antd";

export interface ExperimentCardProps{
    exp_tittle:string,
    description:string
}


export default function ExperimentCard({exp_tittle,description}:ExperimentCardProps) {
  return (
    <div className={style.cardwrapper}>
        {/* <Card maxWidth="max-w-xs" marginTop='mt-0'>
            <Title>Iris</Title>
            <Text>Experimentos basados en iris</Text>
        </Card> */}
        <Card title={exp_tittle}
            bordered={false} 
            headStyle={{borderBottom:0}} 
            bodyStyle={{overflow:'auto',height:'100%'} }
            style={{minHeight:'15vh',height:'100%' }}
            extra= {<Button type='primary' icon={<CaretRightOutlined/>} >Abrir</Button>}
            >{description}</Card>
    </div>
  )
}
