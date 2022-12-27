import { ContainerOutlined, DesktopOutlined, ExpandOutlined, PieChartOutlined } from '@ant-design/icons';
import { Card, Collapse, List, Menu, MenuProps, Tabs } from 'antd'
import Sider from 'antd/es/layout/Sider'
import React, { useState } from 'react'
import MenuButton from '../MenuButton';
import style from "./EditorSideBar.module.scss";

type MenuItem = Required<MenuProps>['items'][number];

const { Panel } = Collapse;

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
  } as MenuItem;
}

const items: MenuItem[] = [
  getItem('V1', '1'),
  getItem('V2', '2'),
  getItem('V3', '3'),
  getItem('V4', '4'),
  getItem('V5', '5'),
  getItem('V6', '6'),
  getItem('V7', '7'),
  getItem('V8', '8'),
];

const data = [
  'Racing car sprays burning fuel into crowd.',
  'Japanese princess to wed commoner.',
  'Australian walks 100km after outback crash.',
  'Man charged over missing wedding girl.',
  'Los Angeles battles huge wildfires.',
];


export interface EditorSideBarProps{
    collpased:boolean,
    onCollapse: (collapse:boolean)=>void,
    trigger?: React.ReactNode
}

const text = `
  A dog is a type of domesticated animal.
  Known for its loyalty and faithfulness,
  it can be found as a welcome guest in many households across the world.
`;

export default function EditorSideBar({collpased,onCollapse,trigger = null}:EditorSideBarProps) {

//   const [collapsed1, setCollapsed1] = useState(false);

  return (

    <div className={style.sidebar}>

                <Sider  
                    theme='light' 
                    collapsible 
                    collapsed={collpased} 
                    onCollapse={(value) => onCollapse(value)} 
                    trigger={trigger}
                    width='13vw'
                    collapsedWidth={0}
                    style={{height:'100%', borderRadius:10, overflow:'auto'}}
                >
                     <Tabs
                        tabBarStyle={{position:'sticky'}}
                        style={{padding:10}} 
                        defaultActiveKey="1"
                        items={[
                        {
                            label: `Exp Versions`,
                            key: '1',
                            children:   <Menu
                                            defaultSelectedKeys={['1']}
                                            defaultOpenKeys={['sub1']}
                                            mode="inline"
                                            theme="light"
                                            items={items}
                                            style={{border:0}}
                                        />  ,
                        },
                        {
                            label: `Datasets`,
                            key: '2',
                            children:  <Collapse defaultActiveKey={['1']}  >
                                            <Panel header="This is panel header 1" key="1">
                                                <List
                                                    size="small"
                                                    dataSource={data}
                                                    renderItem={(item) => <List.Item>{item}</List.Item>}
                                                    />
                                            </Panel>
                                            <Panel header="This is panel header 2" key="2">
                                                <List
                                                    size="small"
                                                    dataSource={data}
                                                    renderItem={(item) => <List.Item>{item}</List.Item>}
                                                    />
                                            </Panel>
                                            <Panel header="This is panel header 3" key="3">
                                                <List
                                                    size="small"
                                                    dataSource={data}
                                                    renderItem={(item) => <List.Item>{item}</List.Item>}
                                                    />
                                            </Panel>
                                            </Collapse>,
                        },
                        ]}
                    />
                    {/* <div style={{ height: 32, margin: 16, background: 'rgba(255, 255, 255, 0.2)' }} /> */}
                    {/* <Menu defaultSelectedKeys={['1']} mode="inline" items={items} /> */}
                </Sider>
                    {/* <MenuButton collapsed={collapsed1} onCollpase={()=>{setCollapsed1(!collapsed1)}} /> */}
    </div>
  )
}
