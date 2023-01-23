import { Form, Input, Modal } from 'antd'
import TextArea from 'antd/es/input/TextArea'
import React, { useState } from 'react'
import { IDataset, IExperiment } from '../../store/storetypes'

interface NewDatasetModalProps{
    modalOpen: boolean
    handleOk: (newDataset:IDataset)=>void
    handleCancel: ()=>void,
    confirmLoading : boolean
}

export default function NewDatasetModal({modalOpen,handleCancel,handleOk,confirmLoading}:NewDatasetModalProps) {

    const [datasetName,setDatasetName] = useState('')

    function internalHandleOk(){

        const newExp  = {
            link:'',
            name: datasetName,
            versions: []
       } as IDataset

        handleOk(newExp)

    }

    return (

            <Modal

                open={modalOpen}
                onOk={internalHandleOk}
                onCancel={handleCancel}
                width={'50%'}
                confirmLoading={confirmLoading}
                // style={{padding:'1%'}}
                >
                <h2>New Dataset</h2>
                <Form
                    labelAlign='right'
                    labelCol={{span:5}}
                >
                    <Form.Item
                        label="Experiment Name"
                        name="experimentname"
                        rules={[{required:true,message:'Please input the experiment name'}]}
                    >
                        <Input onChange={(e)=>{
                            const newExpName = e.target.value
                            setDatasetName(newExpName)
                        }} />
                    </Form.Item>
                </Form>
        </Modal>
  )
}
