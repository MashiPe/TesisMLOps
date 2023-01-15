import { ApiOutlined, AppstoreOutlined, BarChartOutlined, ClusterOutlined, FormOutlined, FunctionOutlined, MailOutlined, SettingOutlined, ToolOutlined } from '@ant-design/icons';
import { Button, Collapse, List, Menu, MenuProps, Popover } from 'antd'
import Sider from 'antd/es/layout/Sider'
import React, { useState } from 'react'
import { useAppSelector } from '../../store/hooks';
import { selectDefaults, selectGroups, selectOperatorDefinitionState } from '../../store/slices/OperatorDefinitionSlice/OperatorDefinitionSlice';
import CustomTrigger from '../CustomTrigger/CustomTrigger';
import OperatorInputModal from '../OperatorInputModal';
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

// const items: MenuItem[] = [
//     getItem('Data Ingest', 'sub1', <ApiOutlined />, [
//       getItem('Item 1', null, null, [getItem('Option 1', '1'), getItem('Option 2', '2')], 'group'),
//       getItem('Item 2', null, null, [getItem('Option 3', '3'), getItem('Option 4', '4')], 'group'),
//     ]),
  
//     getItem('Transformation', 'sub2', <FunctionOutlined />, [
//       getItem('Option 5', '5'),
//       getItem('Option 6', '6'),
//       getItem('Submenu', 'sub3', null, [getItem('Option 7', '7'), getItem('Option 8', '8')]),
//     ]),
  
//     getItem('Labeling', 'sub4', <FormOutlined />, [
//       getItem('Option 9', '9'),
//       getItem('Option 10', '10'),
//       getItem('Option 11', '11'),
//       getItem('Option 12', '12'),
//     ]),
//     getItem('Tuning', 'sub5', <ToolOutlined />, [
//       getItem('Option 9', '19'),
//       getItem('Option 10', '110'),
//       getItem('Option 11', '111'),
//       getItem('Option 12', '112'),
//     ]),
//     getItem('Modeling', 'sub6', <ClusterOutlined />, [
//       getItem('Option 9', '29'),
//       getItem('Option 10', '210'),
//       getItem('Option 11', '211'),
//       getItem('Option 12', '212'),
//     ]),
//     getItem('Validation', 'sub7', <BarChartOutlined />, [
//       getItem('Option 9', '39'),
//       getItem('Option 10', '310'),
//       getItem('Option 11', '311'),
//       getItem('Option 12', '312'),
//     ])
// ]
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

const iconMap = {
    'Data Preparation': <FunctionOutlined/>,
    'Modeling': <ClusterOutlined/>,
    'Evaluation': <BarChartOutlined/>
} as {[key:string]:React.ReactNode}

export default function EditorOpBar({collapsed, onCollapse}:EditorOpBarProps) {

    const operatorGroups = useAppSelector(selectGroups)
    const [modelOpen, setModalOpen] = useState(false)
    const [opType,setOpType] = useState('DefaultReader')

    const opDefinition = useAppSelector(selectOperatorDefinitionState)[opType]
    const opValues = useAppSelector(selectDefaults)[opType]


    const _items = Object.keys(operatorGroups).map( (key)=>{
        
        return(
            getItem(key,`opmenu${key}`,iconMap[key], 
                    operatorGroups[key].groups.map((group)=>{
                        return(
                            getItem(group.title,null,null,
                                group.operators.map( (opName)=>{
                                    return(
                                        getItem(opName,`${opName}`)
                                    )
                                } )
                                ,'group')
                        )
                    }) )
        )
        
    } )

    const handleClick:SelectEventHandler = ({key})=>{
        setOpType(key)
        setModalOpen(true)
    }

    function handleOk(values:any){
        console.log(values)
    }

    function handleCancel(){
        console.log('cancel')
        setModalOpen(false)
    }

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
                                                    items={_items}
                                                    style={{border:0, borderRadius:10}}
                                                    // onClick={handleSelect}
                                                    selectedKeys={['']}
                                                    triggerSubMenuAction='click'
                                                    onClick={handleClick}
                                                /> 
                                </div>


                            <CustomTrigger className={style.button} collpased={collapsed} onCollapse={()=>{onCollapse(!collapsed)}} />

                        </div>
                </Sider>

            
        
            <OperatorInputModal
                modalOpen={modelOpen}
                handleCancel={handleCancel}
                handleOk={handleOk}
                opDefinition={opDefinition}
                opValues={opValues}
                opType={opType}
            />

        </div> 
    )
}
