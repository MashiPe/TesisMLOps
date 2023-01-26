import { Text,Metric, Title } from '@tremor/react'
import React from 'react'
import style from "./ExperimentCard.module.scss";
import {CaretRightOutlined, RightOutlined} from "@ant-design/icons";

import {Button, Card } from "antd";
import { createSearchParams, useNavigate } from 'react-router-dom';
import { useLazyGetExperimentInfoQuery, useLazyGetExpVersionInfoQuery } from '../../store/api/flaskslice';
import { addExperimentVersion, setExpInfo } from '../../store/slices/CurrentExp/currentExpSlice';
import { useAppDispatch } from '../../store/hooks';
import {Buffer} from 'buffer'
import { IExperiment } from '../../store/storetypes';

export interface ExperimentCardProps{
    exp_tittle:string,
    description:string,
    IRI: string
}


export default function ExperimentCard({exp_tittle,description,IRI}:ExperimentCardProps) {

    const navigate = useNavigate();
    const [getExpInfo] = useLazyGetExperimentInfoQuery()
    const [getVersionInfo] = useLazyGetExpVersionInfoQuery()
    const dispatch = useAppDispatch()

    function goToExp(){
        navigate({
            pathname: "/editor",
            search: `?${
                createSearchParams({
                    exp:encodeURIComponent(IRI)
                })
            }`
        })
       
        console.log("IRI",IRI)
        const encodedIRI = Buffer.from(IRI).toString('base64')

        getExpInfo(encodedIRI).unwrap()
        .then( (expInfo)=>{
            const exp_dic = {} as IExperiment
            exp_dic.link = IRI 
            exp_dic.name = expInfo.name   
            exp_dic.versions = {}
            dispatch(setExpInfo(exp_dic))

            console.log("getting versions")
            // Object.keys(expInfo.versions).map((key)=>{
            //     getVersionInfo(expInfo.versions[key]).unwrap()
            //     .then( (version_info)=>{
            //         dispatch(addExperimentVersion({
            //             version:{...version_info,datasetList:[],modelList:[],graphList:[]},
            //             version_name:key
            //         }))
            //     } )
            // })
            
            navigate({
                pathname: "/editor",
                search: `?${
                    createSearchParams({
                        exp:encodeURIComponent(IRI)
                    })
                }`
            })
        } )
        // console.log('ExpIri',expIri)
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
