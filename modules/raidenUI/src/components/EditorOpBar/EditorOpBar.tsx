import { Button, Collapse, List, Menu, MenuProps } from 'antd'
import Sider from 'antd/es/layout/Sider'
import React from 'react'
import CustomTrigger from '../CustomTrigger/CustomTrigger';
import style from './EditorOpBar.module.scss' 

type MenuItem = Required<MenuProps>['items'][number];

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
  getItem('V1', '11'),
  getItem('V2', '2'),
  getItem('V3', '3'),
  getItem('V4', '4'),
  getItem('V5', '5'),
  getItem('V6', '6'),
  getItem('V7', '7'),
  getItem('V8', '8'),
];

const { Panel } = Collapse;

const data = [
  'Racing car sprays burning fuel into crowd.',
  'Japanese princess to wed commoner.',
  'Australian walks 100km after outback crash.',
  'Man charged over missing wedding girl.',
  'Los Angeles battles huge wildfires.',
];

export interface EditorOpBarProps{
    collapsed:boolean,
    onCollapse: (collapse:boolean)=>void,
}

export default function EditorOpBar({collapsed, onCollapse}:EditorOpBarProps) {
  return (
    <div className={style.opbar}>
        
            <Sider 
                style={{height:'100%' , borderRadius:10}} 
                theme='light' 
                collapsible 
                collapsed={collapsed} 
                onCollapse={(value) => onCollapse(value)} 
                width='300'
                trigger={null}
                >
                    <div className={style.content}>

                            <div className={style.main}>
                                <Menu
                                                // defaultSelectedKeys={['11']}
                                                // defaultOpenKeys={['sub1']}
                                                mode="inline"
                                                theme="light"
                                                items={items}
                                                style={{border:0}}
                                                selectedKeys={['11','2']}
                                            /> 
                            </div>


                        <CustomTrigger className={style.button} collpased={collapsed} onCollapse={()=>{onCollapse(!collapsed)}} />

                    </div>
            </Sider>

    </div> 
  )
}
