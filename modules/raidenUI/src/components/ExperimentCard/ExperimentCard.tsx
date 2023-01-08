import { Text,Metric, Title } from '@tremor/react'
import React from 'react'
import style from "./ExperimentCard.module.scss";
import {CaretRightOutlined, RightOutlined} from "@ant-design/icons";

import {Button, Card } from "antd";
import { createSearchParams, useNavigate } from 'react-router-dom';

export interface ExperimentCardProps{
    exp_tittle:string,
    description:string,
    IRI: string
}


export default function ExperimentCard({exp_tittle,description,IRI}:ExperimentCardProps) {

    const navigate = useNavigate();

    function goToExp(){

        navigate({
            pathname: "/editor",
            search: `?${
                createSearchParams({
                    exp:encodeURIComponent(IRI)
                })
            }`
        })
    }

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
            extra= {<Button 
                        type='primary' 
                        icon={<CaretRightOutlined/>}
                        onClick={goToExp} >Abrir</Button>}
            >{description}</Card>
    </div>
  )
}
