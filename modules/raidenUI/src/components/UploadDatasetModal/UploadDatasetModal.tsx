import { CodeSandboxCircleFilled, FileAddOutlined, UploadOutlined } from '@ant-design/icons'
import { Button, Empty, Form, Input, Modal, Table } from 'antd'
import Upload, { RcFile, UploadProps } from 'antd/es/upload'
import axios from 'axios'
import React, { useState } from 'react'
import { DatasetVersion, MetaRecord, Preview } from '../../store/storetypes'
import type { UploadFile } from 'antd/es/upload/interface';
import Papa from 'papaparse';
import { useAppDispatch } from '../../store/hooks'
import { addVersion } from '../../store/slices/DatasetSlice/datasetSlice'


interface UploadDatasetModalProps{
    modalOpen: boolean
    handleOk: ()=>void
    handleCancel: ()=>void
    datasetName: string,
    datasetKey: string,
}

export default function UploadDatasetModal({modalOpen, datasetName,datasetKey,handleOk,handleCancel}:UploadDatasetModalProps) {
    
    // const [modalOpen, setModalOpen] = useState(false)
// 

    const [fileState, setFile] = useState<RcFile>()
    const [datasetVersion, setDataVersion] = useState<DatasetVersion>()
    const [inputName, setInputName] = useState('')
    const [inputNameStatus,setInputNameStatus] = useState<""|"validating"|"error"|"success"|"warning">('validating')  
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const [progress, setProgress] = useState(0);

    const dispatch = useAppDispatch()

    function buildDatasetVersion(file: RcFile){
        // Papa.parse()
        setFile(file)
        console.log('building version')
        const reader = new FileReader();

        reader.onload = e => {
            const content =e.target!.result as string;
            // console.log("onLoadcontent",content) 
            
            Papa.parse<{[key:string]:string}>(content,{
                header: true,
                complete: function (results){
                    const newDataVersion = {} as DatasetVersion

                    newDataVersion.version_name= inputName
                    newDataVersion.tableName = inputName
                    newDataVersion.preview={} as Preview
                    newDataVersion.preview.meta = results.meta.fields!.map( (field)=>{
                        return { dataIndex:field,key:field,title:field }
                    } )
                    newDataVersion.preview.records= results.data.map((record,index)=>{
                        const keyedRecord = { 'key':index,...record }
                        return keyedRecord
                    })

                    setDataVersion(newDataVersion)
                }
            })
            
            // return e.target!.result
        };
        reader.readAsText(file);

    }


    const handleUpload: UploadProps['customRequest'] = async (options)=>{
        const {onError,onSuccess,onProgress,file} = options

        // console.log(options)

        buildDatasetVersion(file as RcFile)
        // console.log(Papa.parse(file as string))



        const fmData = new FormData();
        const config = {
        headers: { "content-type": "multipart/form-data" },
        onUploadProgress: (event:any)=> {
            const percent = Math.floor((event.loaded / event.total) * 100);
            setProgress(percent);
            if (percent === 100) {
            setTimeout(() => setProgress(0), 1000);
            }
            onProgress!({ percent: (event.loaded / event.total) * 100 });
        }
        };
        fmData.append("image", file);
        try {
            const res = await axios.post(
                "https://jsonplaceholder.typicode.com/posts",
                fmData,
                config
            );

            onSuccess!("Ok");
            console.log("server res: ", res);
        } catch (err:any) {
            console.log("Eroor: ", err);
            const error = new Error("Some error");
            onError!( err );
        }
    }
    
    function internalHandleOk(){
        console.log(datasetVersion)
        if (datasetVersion!=undefined){
            dispatch(addVersion({datasetKey:datasetKey,datasetVersion:datasetVersion!}))
            handleOk() 
            return
        }

        if ( inputName == '' ){
            setInputNameStatus('error')
        }

        if (fileState == undefined){
            setFileList( [{name:'nofile',uid:'-1',status:'error'}] )
        }
        
    }

    // function internalHandleCancel(){

    // }


    return (
    
            <Modal

                open={modalOpen}
                onOk={internalHandleOk}
                onCancel={handleCancel}
                width={'50%'}
                // style={{padding:'1%'}}
                >
                <h1>{`Dataset: ${datasetName}`}</h1>
                <Form>
                    <Form.Item
                        label="Version Name"
                        name="versionName"
                        rules={[{required:true,message:'Please input the version name'}]}
                        validateStatus={inputNameStatus}
                    >
                        <Input onChange={(e)=>{
                            const newInputName = e.target.value
                            setInputName(newInputName)
                            
                            if (datasetVersion != undefined){
                                const newVersion = datasetVersion

                                newVersion.version_name = newInputName
                                newVersion.tableName = newInputName

                                setDataVersion(newVersion)
                            }

                        }} />
                    </Form.Item>
                </Form>
                {
                    datasetVersion == undefined ? 
                    <Empty>
                        <Upload
                            accept='.csv'
                            customRequest={handleUpload}
                            maxCount={1}
                            fileList={fileList}
                        >
                            <Button type='primary' icon={<UploadOutlined/>}>Import CSV</Button>
                        </Upload>
                    </Empty>
                    
                    : 

                    <div style={{maxHeight:'60vh', overflow:'auto',padding:'2.5%'}}>

                        <Table columns={datasetVersion!.preview.meta} dataSource={datasetVersion!.preview.records} />
                        {/* holi */}

                    </div>    
                }    
                {
                    // displayHelp ? <
                }
                

        </Modal>
        
    )
}
