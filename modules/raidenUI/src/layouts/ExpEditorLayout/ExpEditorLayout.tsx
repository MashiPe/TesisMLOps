import { GroupOutlined, HomeOutlined, LeftOutlined, PlayCircleFilled, PlayCircleOutlined } from '@ant-design/icons';
import { Button, Layout, notification, Popover, Tabs } from 'antd'
import { Content, Header } from 'antd/es/layout/layout';
import Sider from 'antd/es/layout/Sider'
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Outlet, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { airflowURL, baseURL } from '../../App';
import EditorOpBar from '../../components/EditorOpBar';
import EditorSideBar from '../../components/EditorSideBar';
import MenuButton from '../../components/MenuButton';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { addExperimentVersion, selectCurrentVersionInfo, selectExperimentInfo, setExpInfo } from '../../store/slices/CurrentExp/currentExpSlice';
import style from "./ExpEditorLayout.module.scss"
import {v4 as uuidv4} from "uuid";
import { useLazyGetExperimentInfoQuery, useLazyGetExpVersionInfoQuery } from '../../store/api/flaskslice';
import { IExperiment } from '../../store/storetypes';
import {Buffer} from 'buffer'
import { useLazyGetDagsListQuery } from '../../store/api/airflowslice';

export default function ExpEditorLayou() {
    const [opBarCollpased, setOpBarCollapsed] = useState(true);
    const [sideCollapsed, setSideCollapsed] = useState(false);
    const [executingPipeline, setExecuting] = useState(false);
    const [dagAvailable,setDagAvailable] = useState(false);
    const [currentDagId, setCurrentDagId] = useState('');

    const location = useLocation();
    const [searchParams, setSearchParams] = useSearchParams();

    const navigate = useNavigate();

    const versionInfo = useAppSelector(selectCurrentVersionInfo)
    const currentExperiment = useAppSelector(selectExperimentInfo)
    const dispatch = useAppDispatch()

    const [currentExperimentState,setCurrentExp] = useState(currentExperiment)
    const [versionInfoState,setVersionInfoState] = useState(versionInfo)
    
    const [getExpInfo] = useLazyGetExperimentInfoQuery()
    const [getVersionInfo] = useLazyGetExpVersionInfoQuery()
    const [getDagsList] = useLazyGetDagsListQuery();


    const [api, contextHolder] = notification.useNotification();

    useEffect(() => {

        const expIri = decodeURIComponent(searchParams.get('exp') as string)
        // console.log("FetchingExp",expIri)

        // console.log("IRI",IRI)
        const encodedIRI = Buffer.from(expIri).toString('base64')

        getExpInfo(encodedIRI).unwrap()
        .then( (expInfo)=>{
            const exp_dic = {} as IExperiment
            exp_dic.link = expIri 
            exp_dic.name = expInfo.name   
            exp_dic.versions = {}
            dispatch(setExpInfo(exp_dic))

            console.log("getting versions")
            Object.keys(expInfo.versions).map((key)=>{
                getVersionInfo(expInfo.versions[key]).unwrap()
                .then( (version_info)=>{
                    console.log("dispatching version",key)
                    dispatch(addExperimentVersion({
                        version:{...version_info,datasetList:[],modelList:[],graphList:[],link:expInfo.versions[key]},
                        version_name:key
                    }))
                } )
            })
            
        } )
    // console.log('ExpIri',expIri)

    }, [searchParams])
    
    useEffect( ()=>{
        setCurrentExp(currentExperiment)
    },[currentExperiment]) 

    useEffect( ()=>{
        setVersionInfoState(versionInfo)
    },[versionInfo]) 

    useEffect( ()=>{
        
        const dagCheckInterval = setInterval(async () =>  {
            var dagsList = await getDagsList('').unwrap()
            
            var filteredDags = dagsList['dags'].filter( ({dag_id})=>{
                return dag_id == currentDagId;
            } )

            if (filteredDags.length>0){
                setDagAvailable(true);
                clearInterval(dagCheckInterval);
            }

        },30000 )

    },[currentDagId])

    async function deploy(){
        api.success({
            message:'Pipeline execution',
            description: 'Pipeline execution started'
        })
        var url = `${baseURL}/genpipeline`


        var body ={
            experiment_name: currentExperimentState.name,
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

            const dag_id = `${currentExperimentState.name.toLowerCase()}${versionInfoState.version_name.toLowerCase()}`
            setCurrentDagId(dag_id);
            
        }catch(err){
           console.log(err); 
        }

    }

    async function execPipeline(){

        try{
            const dag_id = `${currentExperimentState.name.toLowerCase()}${versionInfoState.version_name.toLowerCase()}`
            var url = `${airflowURL}/api/v1/dags/${dag_id}`

            var body_3 = {
                "is_paused": false
            }

            await axios.patch(url,JSON.stringify(body_3)
                ,{headers:{
                    'Content-Type':'application/json',
                },
                auth:{
                    username:'airflow',
                    password:'airflow'
                },
            }
            )
            const dag_run_id = uuidv4()
            url = `${airflowURL}/api/v1/dags/${dag_id}/dagRuns`
            

            var body_2 = {
                dag_run_id:dag_run_id 
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

            var run_state = 'queued'

            while (run_state=='queued'){
               var dag_res = await axios.get<any,{[key:string]:string}>(`${url}/${dag_run_id}`,{
                    auth:{
                        username:'airflow',
                        password:'airflow'
                    },
               })
               run_state = dag_res['state']
            }

            if (run_state == 'success'){
                api.success({
                    message:'Pipeline run result',
                    description: 'Pipeline executed successfully'
                })
            }else{
                api.error({
                    message:'Pipeline run result',
                    description: 'Pipeline execution failed'
                })
            }

        setExecuting(false)
            

        }catch(err){
            console.log(err)
        }
    }

    async function startPipeline(){
        setExecuting(true)
        api.success({
            message:'Pipeline execution',
            description: 'Pipeline execution started'
        })
        var url = `${baseURL}/genpipeline`


        var body ={
            experiment_name: currentExperimentState.name,
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

            url = `${airflowURL}/api/v1/dags/${currentExperimentState.name.toLowerCase()}${versionInfoState.version_name.toLowerCase()}`

            var body_3 = {
                "is_paused": false
            }

            await axios.patch(url,JSON.stringify(body_3)
                ,{headers:{
                    'Content-Type':'application/json',
                },
                auth:{
                    username:'airflow',
                    password:'airflow'
                },
            }
            )
            
            const dag_run_id = uuidv4()
            const dag_id = `${currentExperimentState.name.toLowerCase()}${versionInfoState.version_name.toLowerCase()}`
            url = `${airflowURL}/api/v1/dags/${dag_id}/dagRuns`
            

            var body_2 = {
                dag_run_id:dag_run_id 
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

            var run_state = 'queued'

            while (run_state=='queued'){
               var dag_res = await axios.get<any,{[key:string]:string}>(`${url}/${dag_run_id}`,{
                    auth:{
                        username:'airflow',
                        password:'airflow'
                    },
               })
               run_state = dag_res['state']
            }

            if (run_state == 'success'){
                api.success({
                    message:'Pipeline run result',
                    description: 'Pipeline executed successfully'
                })
            }else{
                api.error({
                    message:'Pipeline run result',
                    description: 'Pipeline execution failed'
                })
            }

        setExecuting(false)
            

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
                        icon={<HomeOutlined/>}
                        onClick = { ()=>{
                            navigate({
                                pathname:"/experiments"
                            })       
                        } }
                    >Home</Button>
                    <div
                        className={style.playbutton}
                    >
                    <Button 
                        type='primary' 
                        icon={<PlayCircleOutlined/>} 
                        // style={{marginRight:'10'} }
                        // className={style.playbutton}
                        onClick={deploy}
                    >Deploy Pipeline</Button>
                    <Button 
                        type='primary' 
                        icon={<PlayCircleOutlined/>} 
                        onClick={execPipeline}
                        disabled={!dagAvailable}
                    >Execute Pipeline</Button>
                    </div>
                </div>

                <div className={style.content}>
                    <EditorSideBar collpased={sideCollapsed} onCollapse={setSideCollapsed } />
                        
                    <div style={{display: 'flex', flexDirection:'column' , alignItems:'center'}}>
                        <EditorOpBar collapsed={opBarCollpased} onCollapse={setOpBarCollapsed}></EditorOpBar>
                        <MenuButton 
                            collapsed={sideCollapsed} 
                            onCollpase={()=>{setSideCollapsed(!sideCollapsed)}} 
                            icon={<GroupOutlined/>}
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
