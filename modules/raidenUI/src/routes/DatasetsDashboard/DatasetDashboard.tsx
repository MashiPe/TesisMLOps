import { BranchesOutlined, FileAddOutlined, FolderAddOutlined } from '@ant-design/icons'
import { ColGrid } from '@tremor/react'
import { Button, Divider, Modal, Upload, UploadProps } from 'antd'
import axios from 'axios'
import React, { useState } from 'react'
import DatasetCard from '../../components/DatasetCard'
import UploadDatasetModal from '../../components/UploadDatasetModal/UploadDatasetModal'
import { useAppSelector } from '../../store/hooks'
import { selectDatasets } from '../../store/slices/DatasetSlice/datasetSlice'
import style from "./DatasetDashboard.module.scss"

export default function DatasetDashboard() {
    const datasets = useAppSelector(selectDatasets)

    // const [open, setOpen] = useState()

    const [modalOpen , setModalOpen] = useState(false)
    const [datasetKeyState, setDatasetKey] = useState('')
    const [datasetNameState,setDatasetName] = useState('')


    return (
        <>
            <div key={'datasetdashboard'} className={style.datasetsdashboard}>
                <div key={"header"}className={style.header}>
                    <h1 style={{flexGrow:1}}>Dataset Dashboard</h1> 
                    <Button type='primary' icon={<FolderAddOutlined/>}>New Dataset</Button>
                </div>
                    <Divider dashed={true}></Divider>
                    <div key={'content'} className={style.content}>
                        {
                            Object.keys(datasets).map( (datasetKey)=>{

                                return(
                                    <div key={`${datasetKey}section`}>
                                        <div className={style.header}>
                                            <h2 style={{flexGrow:1}} key={`title-${datasetKey}`}>{datasets[datasetKey].name}</h2> 
                                                <Button 
                                                    type='primary' 
                                                    icon={<BranchesOutlined/>}
                                                    onClick={ ()=>{
                                                        setDatasetKey(datasetKey)
                                                        setDatasetName(datasets[datasetKey].name)
                                                        setModalOpen(true)
                                                    }} 
                                                    >New Version</Button>
                                        </div>
                                        <Divider key={`divider${datasetKey}`} dashed={true}></Divider> 
                                        <ColGrid key={`colgrid${datasetKey}`} numColsMd={ 4 } gapX="gap-x-6" gapY="gap-y-6" marginTop="mt-6">
                                            {
                                                datasets[datasetKey].versions.map((datasetVersion)=>{
                                                    return(
                                                        <DatasetCard 
                                                            key={`${datasetKey}${datasetVersion.name}`}
                                                            bordered={true} 
                                                            datasetName={datasets[datasetKey].name}
                                                            datasetVersion={datasetVersion}
                                                        />
                                                    )
                                                })
                                            }
                                        </ColGrid>
                                    </div>
                                )
                            } )
                        }
                    </div>
            </div>
            

            <UploadDatasetModal 
                modalOpen={modalOpen}
                datasetKey={datasetKeyState}
                datasetName={datasetNameState} 
                handleCancel={()=>{
                    setModalOpen(false)
                }}
                handleOk={
                    ()=>{
                        setModalOpen(false)
                    }
                }
            />
        </>            
    )
}
