import { AppstoreOutlined, MailOutlined, SettingOutlined } from '@ant-design/icons';
import { Button, Collapse, List, Menu, MenuProps, Popover } from 'antd'
import Sider from 'antd/es/layout/Sider'
import React, { useState } from 'react'
import CustomTrigger from '../CustomTrigger/CustomTrigger';
import style from './EditorOpBar.module.scss' 
// import type { MenuProps } from 'antd';

type MenuItem = Required<MenuProps>['items'][number];
type SelectEventHandler = Required<MenuProps>['onClick'];

function getItem(
  label: React.ReactNode,
  key?: React.Key | null,
  icon?: React.ReactNode,
  children?: MenuItem[],
  type?: 'group',
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
    type,
  } as MenuItem;
}

const items: MenuItem[] = [
    getItem('Data Ingest', 'sub1', <MailOutlined />, [
      getItem('Item 1', null, null, [getItem('Option 1', '1'), getItem('Option 2', '2')], 'group'),
      getItem('Item 2', null, null, [getItem('Option 3', '3'), getItem('Option 4', '4')], 'group'),
    ]),
  
    getItem('Transformation', 'sub2', <AppstoreOutlined />, [
      getItem('Option 5', '5'),
      getItem('Option 6', '6'),
      getItem('Submenu', 'sub3', null, [getItem('Option 7', '7'), getItem('Option 8', '8')]),
    ]),
  
    getItem('Labeling', 'sub4', <SettingOutlined />, [
      getItem('Option 9', '9'),
      getItem('Option 10', '10'),
      getItem('Option 11', '11'),
      getItem('Option 12', '12'),
    ]),
    getItem('Tuning', 'sub5', <SettingOutlined />, [
      getItem('Option 9', '19'),
      getItem('Option 10', '110'),
      getItem('Option 11', '111'),
      getItem('Option 12', '112'),
    ]),
    getItem('Modeling', 'sub6', <SettingOutlined />, [
      getItem('Option 9', '29'),
      getItem('Option 10', '210'),
      getItem('Option 11', '211'),
      getItem('Option 12', '212'),
    ]),
    getItem('Validation', 'sub7', <SettingOutlined />, [
      getItem('Option 9', '39'),
      getItem('Option 10', '310'),
      getItem('Option 11', '311'),
      getItem('Option 12', '312'),
    ])
]
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

    // const [selected,setSelected] = useState([""]);

    // const handleSelect : SelectEventHandler = (e)=>{

    //     console.log(e)

    //     // setSelected(e.selectedKeys)
        
    // }


    return (
        <div className={style.opbar}>
            
                <Sider 
                    style={{height:'100%' , borderRadius:10}} 
                    theme='light' 
                    collapsible 
                    collapsed={collapsed} 
                    onCollapse={(value) => onCollapse(value)} 
                    width='fit-content'
                    trigger={null}
                    >
                        <div className={style.content}>

                                <div className={style.main}>
                                    <Menu
                                                    // defaultSelectedKeys={['11']}
                                                    // defaultOpenKeys={['sub1']}
                                                    mode="vertical"
                                                    theme="light"
                                                    items={items}
                                                    style={{border:0, borderRadius:10}}
                                                    // onClick={handleSelect}
                                                    selectedKeys={['']}
                                                    triggerSubMenuAction='click'
                                                /> 
                                </div>


                            <CustomTrigger className={style.button} collpased={collapsed} onCollapse={()=>{onCollapse(!collapsed)}} />

                        </div>
                </Sider>

        </div> 
    )
}
