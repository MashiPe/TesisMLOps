
import { ColGrid } from '@tremor/react';
import { Tabs } from 'antd';
import React from 'react'
import { useCallback } from 'react';
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
import styles from "./ExpCanvas.module.scss"
// import "./ExpCanvas.module.css"

const initialNodes = [
  { id: '1', position: { x: 0, y: 0 }, data: { label: '1' } },
  { id: '2', position: { x: 25, y: 100 }, data: { label: '2' } },
];

const initialEdges = [{ id: 'e1-2', source: '1', target: '2' }];

export default function ExpCanvas() {
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

    const onConnect = useCallback(
        (connection:any) => setEdges((eds) => addEdge(connection, eds)),
        [setEdges]
    );

    const onChange = (key: string) => {
        console.log(key);
    };
    
    return (
        <div className={styles.workspace} >
            
            <Tabs
                className='.exp-canvas'
                style={{backgroundColor:'#141414', height:'100%',width:'100%',borderRadius:10,padding:10}}
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
                                <OperatorCard/>
                                <OperatorCard/>
                                <OperatorCard/>
                                <OperatorCard/>
                                <OperatorCard/>
                                <OperatorCard/>
                                <OperatorCard/>
                                <OperatorCard/>
                                <OperatorCard/>
                                <OperatorCard/>
                                <OperatorCard/>
                                <OperatorCard/>
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
