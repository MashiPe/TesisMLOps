
import { ColGrid } from '@tremor/react';
import { Tabs } from 'antd';
import React, { useEffect, useMemo, useState } from 'react'
import { useCallback } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
} from 'reactflow';
// 👇 you need to import the reactflow styles
import 'reactflow/dist/style.css';
import DynamicGrid from '../../components/DynamicGrid';
import OperatorCard from '../../components/OperatorCard';
import { useAppSelector } from '../../store/hooks';
import { selectCurrentVersion, selectCurrentVersionInfo, selectExperimentInfo } from '../../store/slices/CurrentExp/currentExpSlice';
import { IOperator } from '../../store/storetypes';
import styles from "./ExpCanvas.module.scss"
// import "./ExpCanvas.module.css"

// const initialNodes = [
//   { id: '1', position: { x: 0, y: 0 }, data: { label: '1' } },
//   { id: '2', position: { x: 25, y: 100 }, data: { label: '2' } },
// ];

// const initialEdges = [{ id: 'e1-2', source: '1', target: '2' }];

export default function ExpCanvas() {

    const currentVersion = useAppSelector( selectCurrentVersion )
    // const experimentInfo = useAppSelector( selectExperimentInfo )

    // const versionObj = experimentInfo.versions[currentVersion]
    const versionObj = useAppSelector( selectCurrentVersionInfo)

    const [keyArray,setKeyArray]= useState([''])
    const [order_list,setOrderList] = useState<string[][]>([])
    const [operatorsState, setOperatorsState]= useState<{[key:string]:IOperator}>({}) 

    // console.log

    useEffect( ()=>{
       
        console.log("ExpCanvas: versionOb",versionObj)

        if (versionObj != undefined){
            console.log("setting")
            setKeyArray(Array.from(Object.keys(versionObj.operators)))
            setOrderList(versionObj.order_list)
            setOperatorsState(versionObj.operators)
        }

    },[versionObj] )

    
    var initialNodes = keyArray.map( (key,index)=>{
        return(
            { id:  `${index}`  ,position:{x:0,y:100*index},data:{ label : key } }
        )
    } )     

    var initialEdges = order_list.map((value)=>{
        return(
            {id:`e${value[0]}-${value[1]}`,source: `${keyArray.indexOf(value[0])}`,target: `${keyArray.indexOf(value[1])}` }
        )
    } ) 

    // var initialNodes = Array.fromObject.keys(versionObj.operators) 

    // console.log(initialNodes)
    // console.log(initialEdges)

    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

    useEffect( ()=>{
            
        if (versionObj!== undefined && currentVersion!=='' ){
            var newNodes = Object.keys(versionObj.operators).map( (key,index)=>{
                return(
                    { id:  `${index}`  ,position:{x:100*index,y:100*index},data:{ label : key } }
                )
            } )     

            var newEdges = versionObj.order_list.map((value)=>{
                return(
                    {id:`e${value[0]}-${value[1]}`,source: `${keyArray.indexOf(value[0])}`,target: `${keyArray.indexOf(value[1])}` }
                )
            } )
            
            setNodes(newNodes)
            setEdges(newEdges)
        }
    },[versionObj,currentVersion] )

    const {search} = useLocation()
    
    const query = useMemo( ()=> new URLSearchParams(search),[search] )

    var expIRI=''

    if (query.get('exp') != null){
        expIRI = decodeURIComponent(query.get('exp')!)
    }

    // const expIRI = decodeURIComponent(query.get('exp'))

    // console.log(expIRI)

    

    const onConnect = useCallback(
        (connection:any) => setEdges((eds) => addEdge(connection, eds)),
        [setEdges]
    );

    const onChange = (key: string) => {
        // console.log(key);
    };
    
    return (
        <div className={styles.workspace} >
            
            <Tabs
                className='.exp-canvas'
                style={{
                    // backgroundColor:'#141414', 
                    height:'100%',width:'100%',borderRadius:10,padding:10}}
                defaultActiveKey='1'
                onChange={onChange}
                items={[
                {
                    label: `Operators`,
                    key: '1',
                    children: 
                        // <DynamicGrid cols={1}>
                        <div style={{overflowY:'auto', height:'100%' ,padding:10}}>
                            <ColGrid numCols={1} gapY={'gap-y-5'}>
                                {
                                    Array.from(Object.keys(operatorsState))
                                    .map(( (value)=>{

                                        // console.log(value)
                                        return( 
                                            <OperatorCard
                                                op_name={value}
                                                 />
                                        )
                                    } ))
                                }
                            </ColGrid>
                        </div>,
                    style:
                        {
                            height:'100%'
                        },
                    
                        // </DynamicGrid>
                },
                {
                    label: `Graph Representation`,
                    key: '2',
                    children: 
                        <div style={{height:'80vh',width:'100%'}}>
                            <ReactFlow
                            nodes={nodes}
                            edges={edges}
                            onNodesChange={onNodesChange}
                            
                            >
                                <Background gap={125}/>
                            </ReactFlow>
                        </div>,
                }
                ]}
            >
                {/* <Tabs */}
            </Tabs>


        </div>
    )
}
