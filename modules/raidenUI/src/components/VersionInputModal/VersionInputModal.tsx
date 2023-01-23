import { Form, Input, Modal } from 'antd'
import React, { useState } from 'react'
import { IVersion } from '../../store/storetypes'

interface VersionInputModal{
    modalOpen: boolean
    handleOk: (version_name:string,newVersion:IVersion)=>void
    handleCancel: ()=>void
}

export default function VersionInputModal({modalOpen,handleCancel,handleOk}:VersionInputModal) {

    const [versionName,setExpName] = useState('')

    function internalHandleOk(){

        const newVersion   = {
            datasetList:[],
            descriptors:{},
            graphList:[],
            io_metadata:{},
            link:'',
            modelList:[],
            operators:{},
            order_list:[],
            version_name:versionName
       } as IVersion

        handleOk(versionName,newVersion)

    }

    return (

            <Modal

                open={modalOpen}
                onOk={internalHandleOk}
                onCancel={handleCancel}
                width={'50%'}
                // style={{padding:'1%'}}
                >
                <h2>New Experiment</h2>
                <Form
                    labelAlign='right'
                    labelCol={{span:5}}
                >
                    <Form.Item
                        label="Version Name"
                        name="versionname"
                        rules={[{required:true,message:'Please input the verions name'}]}
                    >
                        <Input onChange={(e)=>{
                            const newExpName = e.target.value
                            setExpName(newExpName)
                        }} />
                    </Form.Item>
                </Form>
        </Modal>
  )
}
