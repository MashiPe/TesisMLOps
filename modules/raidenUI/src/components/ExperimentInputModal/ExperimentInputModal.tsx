
import { Form, Input, Modal } from 'antd'
import TextArea from 'antd/es/input/TextArea'
import React, { useState } from 'react'
import { IExperiment } from '../../store/storetypes'

interface ExperimentInputModal{
    modalOpen: boolean
    handleOk: (newExp:IExperiment)=>void
    handleCancel: ()=>void
}

export default function ExperimentInputModal({modalOpen,handleCancel,handleOk}:ExperimentInputModal) {

    const [expName,setExpName] = useState('')
    const [expDescription,setExpDescription]= useState('')

    function internalHandleOk(){

        const newExp  = {
            description: expDescription,
            name :expName,
            versions: {},
            link:''
       } as IExperiment

        handleOk(newExp)

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
                        label="Experiment Name"
                        name="experimentname"
                        rules={[{required:true,message:'Please input the experiment name'}]}
                    >
                        <Input onChange={(e)=>{
                            const newExpName = e.target.value
                            setExpName(newExpName)
                        }} />
                    </Form.Item>
                    <Form.Item
                        label="Experiment Description"
                        name="experimentdescription"
                        rules={[{required:false}]}
                    >
                        <TextArea onChange={(e)=>{
                            const newExpDescription = e.target.value
                            setExpDescription(newExpDescription)
                        }} />
                    </Form.Item>
                </Form>
        </Modal>
  )
}
