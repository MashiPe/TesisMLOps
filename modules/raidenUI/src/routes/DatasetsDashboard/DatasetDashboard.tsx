import { FileAddOutlined, FolderAddOutlined } from '@ant-design/icons'
import { ColGrid } from '@tremor/react'
import { Button, Divider, Modal, Upload, UploadProps } from 'antd'
import axios from 'axios'
import React from 'react'
import DatasetCard from '../../components/DatasetCard'
import { useAppSelector } from '../../store/hooks'
import { selectDatasets } from '../../store/slices/DatasetSlice/datasetSlice'
import style from "./DatasetDashboard.module.scss"

export default function DatasetDashboard() {
    const datasets = useAppSelector(selectDatasets)

    // const [open, setOpen] = useState()

    const handleUpload: UploadProps['customRequest'] = async (options)=>{
        const {onError,onSuccess,onProgress,file} = options

        const fmData = new FormData();
        const config = {
        headers: { "content-type": "multipart/form-data" },
        onUploadProgress: (event:any)=> {
            const percent = Math.floor((event.loaded / event.total) * 100);
            // setProgress(percent);
            if (percent === 100) {
            // setTimeout(() => setProgress(0), 1000);
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
                                            <Upload
                                                accept='.csv'
                                                customRequest={handleUpload}
                                                
                                            >
                                                <Button type='primary' icon={<FileAddOutlined/>}>Import CSV</Button>
                                            </Upload>
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
        
        </>            
    )
}
