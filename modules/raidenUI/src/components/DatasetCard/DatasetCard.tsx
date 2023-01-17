import { EyeOutlined } from '@ant-design/icons'
import { Button, Card } from 'antd'
import React, { useState } from 'react'
import { DatasetVersion } from '../../store/storetypes'
import DataTableVisualization from '../DataTableVisualization'
import style from "./DatasetCard.module.scss"

export interface DatasetCardProps{
    datasetVersion: DatasetVersion
    datasetName: string
    bordered: boolean
}

export default function DatasetCard({datasetName,datasetVersion,bordered}:DatasetCardProps) {
  
    const [modalOpen,setModalOpen] = useState(false)
    
    function handleClick(){
        setModalOpen(true)
    }

    function closeModal(){
        setModalOpen(false)
    }

    return (
        <>
            <div className={style.cardwrapper}>
                <Card 

                    bordered={bordered} 
                    headStyle={{borderBottom:0}} 
                    bodyStyle={{
                        height:'100%', 
                        display:'flex',
                        alignContent:'center',
                        alignItems:'center',
                        padding:'1%'
                    } }
                    style={{height:'100%',width:'100%' }}
                    >
                    <h1 style={{flexGrow:1}} >{datasetVersion.name}</h1>
                    <Button

                        type='primary' 
                        icon={<EyeOutlined/>}
                        onClick={handleClick} ></Button>
                    </Card>
            </div>
            <DataTableVisualization 
                datasetName={datasetName} 
                datasetVersion={datasetVersion}
                modalOpen={modalOpen}
                handleCancel={closeModal}
                handleOk={closeModal}
                />
        </>
  )
}
