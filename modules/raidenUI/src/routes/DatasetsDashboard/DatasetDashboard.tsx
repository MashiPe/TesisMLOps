import { BranchesOutlined, FileAddOutlined, FolderAddOutlined } from '@ant-design/icons'
import { ColGrid } from '@tremor/react'
import { Button, Divider, Modal, Upload, UploadProps } from 'antd'
import axios from 'axios'
import React, { useState } from 'react'
import DatasetCard from '../../components/DatasetCard'
import NewDatasetModal from '../../components/NewDatasetModal'
import UploadDatasetModal from '../../components/UploadDatasetModal/UploadDatasetModal'
import { usePostDatasetMutation } from '../../store/api/flaskslice'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { addDataset, selectDatasets } from '../../store/slices/DatasetSlice/datasetSlice'
import { IDataset } from '../../store/storetypes'
import style from "./DatasetDashboard.module.scss"

export default function DatasetDashboard() {
    const datasets = useAppSelector(selectDatasets)

    // const [open, setOpen] = useState()

    const [fileModalOpen, setFileModalOpen] = useState(false)
    const [newDatasetOpen , setNewDatasetOpen] = useState(false)
    const [datasetKeyState, setDatasetKey] = useState('')
    const [datasetNameState,setDatasetName] = useState('')
    const [datasetIriState,setDatasetIri] = useState('')

    const [uploadingFile,setUploading] = useState(false)
    const [creatingDataset,setCreatingDataset] = useState(false)


    const [sendNewDataset,{isLoading}] = usePostDatasetMutation()
    const dispatch = useAppDispatch()

    async function handleNewDataset(newIDataset:IDataset){
        
        setCreatingDataset(true)
        
        try{
            const new_Dataset_info = await sendNewDataset(newIDataset).unwrap()
            dispatch(addDataset(new_Dataset_info))
            setCreatingDataset(false)
            setNewDatasetOpen(false)
        }catch{
            console.log('error')
        } 
        
    }

    return (
        <>
            <div key={'datasetdashboard'} className={style.datasetsdashboard}>
                <div key={"header"}className={style.header}>
                    <h1 style={{flexGrow:1}}>Dataset Dashboard</h1> 
                    <Button 
                        type='primary' 
                        icon={<FolderAddOutlined/>}
                        onClick={()=>{
                            setNewDatasetOpen(true)
                        }}    
                    >New Dataset</Button>
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
                                                        setDatasetIri(datasets[datasetKey].link)
                                                        setFileModalOpen(true)
                                                    }} 
                                                    >New Version</Button>
                                        </div>
                                        <Divider key={`divider${datasetKey}`} dashed={true}></Divider> 
                                        <ColGrid key={`colgrid${datasetKey}`} numColsMd={ 4 } gapX="gap-x-6" gapY="gap-y-6" marginTop="mt-6">
                                            {
                                                datasets[datasetKey].versions.map((datasetVersion)=>{
                                                    return(
                                                        <DatasetCard 
                                                            key={`${datasetKey}${datasetVersion.version_name}`}
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
                dataset_iri={datasetIriState}
                modalOpen={fileModalOpen}
                datasetKey={datasetKeyState}
                datasetName={datasetNameState} 
                handleCancel={()=>{
                    setFileModalOpen(false)
                }}
                handleOk={
                    ()=>{
                        setFileModalOpen(false)
                    }
                }
            />

            {
                !newDatasetOpen ? <></> : <NewDatasetModal
                modalOpen={newDatasetOpen}
                handleCancel={()=>{
                    setNewDatasetOpen(false)
                }}
                handleOk={handleNewDataset}
                confirmLoading= {creatingDataset}
            />
 
            }             
        </>            
    )
}
