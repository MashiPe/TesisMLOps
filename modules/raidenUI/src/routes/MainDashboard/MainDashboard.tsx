
import { ColGrid } from '@tremor/react'
import React from 'react'
import DynamicGrid from '../../components/DynamicGrid'
import ExperimentCard from '../../components/ExperimentCard'
import { useAppSelector } from '../../store/hooks'
import { selectExperimentList } from '../../store/slices/ExperimentsSlice/experimentsSlice'

export default function MainDashboard(){

    const experiments = useAppSelector(selectExperimentList)

    return (
            
        <div style={{overflowY:'auto',height:'100%'}}>
            <ColGrid numColsMd={ 3 } gapX="gap-x-6" gapY="gap-y-6" marginTop="mt-6">
            {/* // <DynamicGrid cols={3} > */}
                {/* <ExperimentCard exp_tittle='Iris' description='Experimentos basados en dataset iris'></ExperimentCard>
                <ExperimentCard exp_tittle='Iris' description='Experimentos basados en dataset iris'></ExperimentCard>
                <ExperimentCard exp_tittle='Iris' description='Experimentos basados en dataset iris'></ExperimentCard>
                <ExperimentCard exp_tittle='Iris' description='Experimentos basados en dataset iris'></ExperimentCard>
                <ExperimentCard exp_tittle='Iris' description='Experimentos basados en dataset iris'></ExperimentCard>
                <ExperimentCard exp_tittle='Iris' description='Experimentos basados en dataset iris'></ExperimentCard>
                <ExperimentCard exp_tittle='Iris' description='Experimentos basados en dataset iris'></ExperimentCard>
                
                <ExperimentCard exp_tittle='Iris' description='Experimentos basados en dataset iris'></ExperimentCard>
                <ExperimentCard exp_tittle='Iris' description='Experimentos basados en dataset iris'></ExperimentCard>
                <ExperimentCard exp_tittle='Iris' description='Experimentos basSDfsfdadfsadfas
                dfasdfasdfsasdasd asdasdsad asdasdadsdaados en dataset iris asddddddddddddddddddddddd
                assssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssss
                asdfasdf asdasd'></ExperimentCard>
                <ExperimentCard exp_tittle='Iris' description='Experimentos basados en dataset iris'></ExperimentCard>
                <ExperimentCard exp_tittle='Iris' description='Experimentos basados en dataset iris'></ExperimentCard>
                <ExperimentCard exp_tittle='Iris' description='Experimentos basados en dataset iris'></ExperimentCard>
                <ExperimentCard exp_tittle='Iris' description='Experimentos basados en dataset iris'></ExperimentCard>
                <ExperimentCard exp_tittle='Iris' description='Experimentos basados en dataset iris'></ExperimentCard>
                <ExperimentCard exp_tittle='Iris' description='Experimentos basados en dataset iris'></ExperimentCard>
                <ExperimentCard exp_tittle='Iris' description='Experimentos basados en dataset iris'></ExperimentCard>
                <ExperimentCard exp_tittle='Iris' description='Experimentos basados en dataset iris'></ExperimentCard>
                <ExperimentCard exp_tittle='Iris' description='Experimentos basados en dataset iris'></ExperimentCard> */}
            {/* // </DynamicGrid> */}
                {
                    experiments.map( (exp)=>{
                        
                        return(
                            <ExperimentCard key={exp.link} description={exp.description} exp_tittle={exp.name} IRI={exp.link}></ExperimentCard>
                        )
                    } )
                }
            </ColGrid>
        </div>
        
    )
}
