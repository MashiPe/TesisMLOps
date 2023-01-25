import { Form, Modal, Table } from 'antd'
import React from 'react'
import { useAppSelector } from '../../store/hooks'
import { selectDatasets } from '../../store/slices/DatasetSlice/datasetSlice'
import {DatasetVersion} from "../../store/storetypes"

export interface OperatorInputModalProps{
    modalOpen:boolean,
    handleOk: (values:any)=>void,
    handleCancel: ()=>void,
    datasetName: string,
    datasetVersion: DatasetVersion,
}


export default function DataTableVisualization({handleCancel,handleOk,modalOpen,datasetName,datasetVersion}:OperatorInputModalProps) {
  
    // const datasets  = useAppSelector(selectDatasets)

    // const datasetVersion = datasets['DatasetTest'].versions[0]

    return (
            <Modal

                open={modalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
                width={'50%'}
                // style={{padding:'1%'}}
                >
                <h1>{`Dataset: ${datasetName}`}</h1>
                <h2>{`Version: ${datasetVersion.version_name}`}</h2>
                <div style={{maxHeight:'60vh', overflow:'auto',padding:'2.5%'}}>

                    <Table 
                        columns={datasetVersion.preview.meta} 
                        dataSource={datasetVersion.preview.records}
                        rowKey='id' 
                        />

                </div>    

        </Modal>
  )
}
