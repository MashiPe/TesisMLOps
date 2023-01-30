
import { ExperimentOutlined, FastBackwardFilled } from '@ant-design/icons'
import { ColGrid } from '@tremor/react'
import { Button, theme } from 'antd'
import { Header } from 'antd/es/layout/layout'
import React, { useState } from 'react'
import { Background } from 'reactflow'
import DataTableVisualization from '../../components/DataTableVisualization'
import DynamicGrid from '../../components/DynamicGrid'
import ExperimentCard from '../../components/ExperimentCard'
import ExperimentInputModal from '../../components/ExperimentInputModal'
import { usePostExperimentMutation } from '../../store/api/flaskslice'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { selectDatasets } from '../../store/slices/DatasetSlice/datasetSlice'
import { addExperiment, selectExperimentList } from '../../store/slices/ExperimentsSlice/experimentsSlice'
import { IExperiment } from '../../store/storetypes'
import style from "./ExperimentsDashboard.module.scss"

export default function ExperimentsDashboard(){

    const [confirmLoading,setConfirmLoading] = useState(false)
    const [modalOpen,setModalOpen] = useState(false)
    const [addExp,{isLoading, isError}] = usePostExperimentMutation()

    const experiments = useAppSelector(selectExperimentList)
    const dispatch = useAppDispatch()

    
    
    function openModal(){
        setModalOpen(true)
    }

    async function handleNewExperiment (newExp:IExperiment){
        
        setConfirmLoading(true)

        try{
            const exp_info = await addExp(newExp).unwrap()
            dispatch(addExperiment(exp_info))
            setModalOpen(false)
            setConfirmLoading(false)
        }catch{
            console.log("Error")
        }    
            
    }

    return (
            
        <div style={{overflowY:'auto',height:'100%'}}>
            <Header className={style.header} style={ {
                                                        background:'white', 
                                                        display: 'flex', 
                                                        flexFlow: 'row',
                                                        alignItems: 'center',
                                                        alignContent: 'center' } } >
                <Button 
                    className={style.lastitem}
                    type='primary' 
                    icon={<ExperimentOutlined/>}
                    onClick={openModal}
                    >New Experiment</Button>
            </Header>
            <ColGrid numColsMd={ 3 } gapX="gap-x-6" gapY="gap-y-6" marginTop="mt-6">
                {
                    experiments.map( (exp)=>{
                        
                        return(
                            <ExperimentCard key={exp.link} description={exp.description} exp_tittle={exp.name} IRI={exp.link}></ExperimentCard>
                        )
                    } )
                }
            </ColGrid>

            <ExperimentInputModal
                handleCancel={()=>{
                    setModalOpen(false)
                }}
                handleOk={handleNewExperiment}
                modalOpen={modalOpen}
                confirmLoading={confirmLoading}
            />

        </div>
        
    )
}
