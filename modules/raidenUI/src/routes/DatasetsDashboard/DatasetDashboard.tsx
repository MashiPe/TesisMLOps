import { ColGrid } from '@tremor/react'
import { Divider } from 'antd'
import React from 'react'
import DatasetCard from '../../components/DatasetCard'
import { useAppSelector } from '../../store/hooks'
import { selectDatasets } from '../../store/slices/DatasetSlice/datasetSlice'

export default function DatasetDashboard() {
    const datasets = useAppSelector(selectDatasets)

    // const [open, setOpen] = useState()

    return (
            
        <div style={{overflowY:'auto',height:'100%'}}>
            {
                Object.keys(datasets).map( (datasetKey)=>{

                    return(
                        <>
                            <h2>{datasets[datasetKey].name}</h2>

                            <Divider ></Divider>
                            <ColGrid numColsMd={ 4 } gapX="gap-x-6" gapY="gap-y-6" marginTop="mt-6">
                                {
                                    datasets[datasetKey].versions.map((datasetVersion)=>{
                                        return(
                                            <DatasetCard 
                                                bordered={true} 
                                                datasetName={datasets[datasetKey].name}
                                                datasetVersion={datasetVersion}
                                             />
                                        )
                                    })
                                } 
                            </ColGrid>
                        </>
                    )
                } )
            }
            {/* <ColGrid numColsMd={ 3 } gapX="gap-x-6" gapY="gap-y-6" marginTop="mt-6">
                {
                    Object.keys(datasets).map( (datasetKey)=>{
                        
                        return(
                            <DatasetCard  />
                        )
                    } )
                }
            </ColGrid> */}
            {/* <DataTableVisualization 
                datasetName={datasets['DatasetTest'].name}
                datasetVersion={datasetVersion}
                handleCancel={()=>{}} 
                handleOk={()=>{}} 
                modalOpen={true} /> */}
        </div>

        
    )
}
