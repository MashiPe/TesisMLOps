
import { ColGrid } from '@tremor/react'
import React, { useState } from 'react'
import DataTableVisualization from '../../components/DataTableVisualization'
import DynamicGrid from '../../components/DynamicGrid'
import ExperimentCard from '../../components/ExperimentCard'
import { useAppSelector } from '../../store/hooks'
import { selectDatasets } from '../../store/slices/DatasetSlice/datasetSlice'
import { selectExperimentList } from '../../store/slices/ExperimentsSlice/experimentsSlice'

export default function ExperimentsDashboard(){

    const experiments = useAppSelector(selectExperimentList)

    // const [open, setOpen] = useState()

    return (
            
        <div style={{overflowY:'auto',height:'100%'}}>
            <ColGrid numColsMd={ 3 } gapX="gap-x-6" gapY="gap-y-6" marginTop="mt-6">
                {
                    experiments.map( (exp)=>{
                        
                        return(
                            <ExperimentCard key={exp.link} description={exp.description} exp_tittle={exp.name} IRI={exp.link}></ExperimentCard>
                        )
                    } )
                }
            </ColGrid>
            {/* <DataTableVisualization 
                datasetName={datasets['DatasetTest'].name}
                datasetVersion={datasetVersion}
                handleCancel={()=>{}} 
                handleOk={()=>{}} 
                modalOpen={true} /> */}
        </div>

        
    )
}
