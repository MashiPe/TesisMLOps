import { GroupOutlined, LeftOutlined, PlayCircleFilled, PlayCircleOutlined } from '@ant-design/icons';
import { Button, Layout, Popover, Tabs } from 'antd'
import { Content, Header } from 'antd/es/layout/layout';
import Sider from 'antd/es/layout/Sider'
import axios from 'axios';
import React, { useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom';
import { baseURL } from '../../App';
import EditorOpBar from '../../components/EditorOpBar';
import EditorSideBar from '../../components/EditorSideBar';
import MenuButton from '../../components/MenuButton';
import { useAppSelector } from '../../store/hooks';
import { selectCurrentVersionInfo, selectExperimentInfo } from '../../store/slices/CurrentExp/currentExpSlice';
import style from "./ExpEditorLayout.module.scss"
import {v4 as uuidv4} from "uuid";

export default function ExpEditorLayou() {
    const [opBarCollpased, setOpBarCollapsed] = useState(true);
    const [sideCollapsed, setSideCollapsed] = useState(false);
    
    const navigate = useNavigate();

    const versionInfo = useAppSelector(selectCurrentVersionInfo)

    const currentExperiment = useAppSelector(selectExperimentInfo)


    async function startPipeline(){
        var url = `${baseURL}/genpipeline`


        var body ={
            experiment_name: currentExperiment.name,
            ...versionInfo
        }
        try{
            await axios.post(url,JSON.stringify(body),{
                headers:{
                    'Content-Type':'application/json'
                }
            })
        
            url = `${baseURL}/desplegar`
            
            var body_1 = {
                servicios:['python']
            }

            await axios.post(url,JSON.stringify(body_1),{
                headers:{
                    'Content-Type':'application/json'
                }
            })

            
            url = `http://localhost:8080/api/v1/dags/${currentExperiment.name.toLowerCase()}${versionInfo.version_name.toLowerCase()}/dagRuns`
            
            var body_2 = {
                dag_run_id: uuidv4()
            }

            await axios.post(url,JSON.stringify(body_2),{
                headers:{
                    'Content-Type':'application/json',
                },
                auth:{
                    username:'airflow',
                    password:'airflow'
                },
            })

        }catch(err){
            console.log(err)
        }

    }

    return (
        
        <Layout  style={{ minHeight: '100%' }}>
            
            <div className={style.expeditorlayout}>

                <div className={style.header}>
                    <Button 
                        type='primary' 
                        icon={<LeftOutlined/>}
                        onClick = { ()=>{
                            navigate({
                                pathname:"/experiments"
                            })       
                        } }
                    >Home</Button>
                    <Button 
                        type='primary' 
                        icon={<PlayCircleOutlined/>} 
                        className={style.playbutton}
                        onClick={startPipeline}
                    >Start Pipline</Button>
                </div>

                <div className={style.content}>
                    <EditorSideBar collpased={sideCollapsed} onCollapse={setSideCollapsed } />
                        
                    <div style={{display: 'flex', flexDirection:'column' , alignItems:'center'}}>
                        <EditorOpBar collapsed={opBarCollpased} onCollapse={setOpBarCollapsed}></EditorOpBar>
                        <MenuButton 
                            collapsed={sideCollapsed} 
                            onCollpase={()=>{setSideCollapsed(!sideCollapsed)}} 
                            icon={<GroupOutlined/>}
                            // style={
                            //     {
                            //         position:'relative',
                            //         bottom:0
                            //     }
                        />
                    </div>

                    <Outlet/>
                </div>



            

            </div>

            {/* <Popover
                trigger={'click'}
                onOpenChange={habldeClickChange}>
                <Button>Holi</Button>
            </Popover> */}

        </Layout>
        
    )
}
