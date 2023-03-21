import { ApiOutlined, AppstoreOutlined, BarChartOutlined, ClusterOutlined, FormOutlined, FunctionOutlined, MailOutlined, SettingOutlined, ToolOutlined } from '@ant-design/icons';
import { Button, Collapse, List, Menu, MenuProps, Popover } from 'antd'
import Sider from 'antd/es/layout/Sider'
import React, { useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { selectDefaults, selectGroups, selectOperatorDefinitionState } from '../../store/slices/OperatorDefinitionSlice/OperatorDefinitionSlice';
import { IOperator } from '../../store/storetypes';
import CustomTrigger from '../CustomTrigger/CustomTrigger';
import OperatorInputModal from '../OperatorInputModal';
import style from './EditorOpBar.module.scss' 
// import randomstring from 'randomstring';
import { selectCurrentVersion, selectCurrentVersionInfo, selectExperimentInfo, setOperator } from '../../store/slices/CurrentExp/currentExpSlice';
import { usePostOperatorMutation } from '../../store/api/flaskslice';
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

const { Panel } = Collapse;

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
    const [opName, setOpName] = useState('')

    const opDefinitions = useAppSelector(selectOperatorDefinitionState)
    const opDefaultValues = useAppSelector(selectDefaults)
    const workingVersion = useAppSelector(selectCurrentVersion)
    const expInfo = useAppSelector(selectExperimentInfo)
    const dispatch = useAppDispatch()

    // const [opValuesState , setOpValues] = useState(op);

    const [postNewOp] = usePostOperatorMutation()

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

    function randomstring(length:number) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

    function handleOk(values:IOperator){
        console.log("Generating new operator", values)
        console.log("ExpInfo",expInfo)
        const op_name = randomstring(7)
       
        var input_def: string[] = []
    var out_def: string[] = []

        const opDefinition = opDefinitions[opType]

        input_def = input_def.concat(Array(opDefinition.inputDef.datasetInputs).fill('dataset'))
        input_def = input_def.concat(Array(opDefinition.inputDef.modelInputs).fill('model'))

        out_def= out_def.concat(Array(opDefinition.outputDef.datasetOutput).fill('dataset'))
        out_def=out_def.concat(Array(opDefinition.outputDef.modelOutputs).fill('model'))
        out_def=out_def.concat(Array(opDefinition.outputDef.graphicsOutput).fill('graph'))

        postNewOp({version_iri:expInfo.versions[workingVersion].link,
                operator:{...values,name:op_name,type:opType,input_type:input_def,output_type:out_def}}).unwrap()
        .then((new_op)=>{
            setOpName(opName)
            dispatch(setOperator({op_name:op_name,operator:new_op}))
            setModalOpen(false)
        })
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
                opName={opName}
                modalOpen={modelOpen}
                handleCancel={handleCancel}
                handleOk={handleOk}
                opDefinition={opDefinitions[opType]}
                opValues={opDefaultValues[opType]}
                opType={opType}
            />

        </div> 
    )
}
