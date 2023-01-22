import { AppstoreAddOutlined, ContainerOutlined, DesktopOutlined, ExpandOutlined, PieChartOutlined } from '@ant-design/icons';
import { Button, Card, Collapse, List, Menu, MenuProps, Tabs, TabsProps } from 'antd'
import Sider from 'antd/es/layout/Sider'
import React, { useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { addExperimentVersion, selectCurrentVersion, selectExperimentInfo, setCurrentVersion } from '../../store/slices/CurrentExp/currentExpSlice';
import { addVersion, selectDatasets } from '../../store/slices/DatasetSlice/datasetSlice';
import { addExperiment } from '../../store/slices/ExperimentsSlice/experimentsSlice';
import { IVersion } from '../../store/storetypes';
import DatasetCard from '../DatasetCard';
import VersionInputModal from '../VersionInputModal';
import styles from "./EditorSideBar.module.scss";

// const renderTabBar: TabsProps['renderTabBar'] = (props, DefaultTabBar) => (
//   <Sticky enabled={true} top={53} innerZ={1}>
//     <DefaultTabBar {...props} style={{backgroundColor:'#141414',paddingTop:5}} id='tab' />
//   </Sticky>
// );

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

// const items: MenuItem[] = [
//   getItem('V1', '11'),
//   getItem('V2', '2'),
//   getItem('V3', '3'),
//   getItem('V4', '4'),
//   getItem('V5', '5'),
//   getItem('V6', '6'),
//   getItem('V7', '7'),
//   getItem('V8', '8'),


export interface EditorSideBarProps{
    collpased:boolean,
    onCollapse: (collapse:boolean)=>void,
    trigger?: React.ReactNode
}


export default function EditorSideBar({collpased,onCollapse,trigger = null}:EditorSideBarProps) {


    const dispatch = useAppDispatch();
    const experimentInfo = useAppSelector( selectExperimentInfo );
    const currentVersion = useAppSelector( selectCurrentVersion);
    const datasets = useAppSelector(selectDatasets)

    const versionsArray = Array.from(Object.keys(experimentInfo.versions))

    const [newVersionModalOpen, setNewVersionModalOpen] = useState(false)

    var items =  versionsArray.map( (versionName,index)=>{
        
        return(
            getItem(versionName,`${versionName}`)
        )
        
    } )

    function handleNewVersion(version_name:string,newVersion:IVersion){

        //TODO: Integrate with API

        dispatch(addExperimentVersion({version_name:version_name,version:newVersion}))
        setNewVersionModalOpen(false)
    }

    function openNewVersionModal(){
        setNewVersionModalOpen(true)
    }

    function handleCancel(){
        setNewVersionModalOpen(false)
    }

    const handleSelect : MenuProps['onSelect'] = ({key})=>{
        console.log(key)

        dispatch(setCurrentVersion(key))
    }

  return (

    <div className={styles.sidebar} >

        <Sider  
            theme='light' 
            collapsible 
            collapsed={collpased} 
            onCollapse={(value) => onCollapse(value)} 
            trigger={trigger}
            width='300'
            collapsedWidth={0}
            style={{height:'100%', borderRadius:10, overflow:'auto'}}
        >
        
                <Tabs
                    // tabBarStyle={{position:'sticky', top:'0'}}
                    // renderTabBar={renderTabBar}
                    style={{padding:10}} 
                    defaultActiveKey='1'
                    items={[
                    {
                        label: `Exp Versions`,
                        key: '21',
                        children:   
                                    <>
                                        <Button 
                                            type='primary'
                                            style={
                                                {
                                                    display: 'block',
                                                    marginLeft: 'auto',
                                                    marginRight: '1%',
                                                    marginBottom: '5%'
                                                    // paddingRight:'1%'
                                                }
                                            }
                                            icon={<AppstoreAddOutlined/>}
                                            onClick={openNewVersionModal}
                                        />
                                        <Menu
                                            defaultSelectedKeys={[`${currentVersion}`]}
                                            // defaultOpenKeys={['sub1']}
                                            mode="inline"
                                            theme="light"
                                            items={items}
                                            style={{border:0}}
                                            onSelect= { handleSelect }
                                        />  
                                    </>
                    },
                    {
                        label: `Datasets`,
                        key: '2',
                        children:  <Collapse  >
                                        {
                                            Object.keys(datasets).map( (dataKey,index)=>{
                                                return(
                                                    <Panel 
                                                        key={index}                                                                
                                                        header={datasets[dataKey].name} >
                                                        
                                                        {
                                                            <List
                                                                bordered={false}
                                                                size={"small"}
                                                                dataSource={datasets[dataKey].versions}
                                                                renderItem={
                                                                    (datasetVersion)=>{
                                                                        return(
                                                                            <List.Item style={{border:0}}>
                                                                                <DatasetCard
                                                                                    bordered={false}
                                                                                    datasetName={datasets[dataKey].name}
                                                                                    datasetVersion={datasetVersion}
                                                                                    key={`${datasets[dataKey].name}${datasetVersion.version_name}`}
                                                                                />
                                                                            </List.Item>
                                                                        )
                                                                    }
                                                                }
                                                            />
                                                        }

                                                    </Panel>
                                                )
                                            } )
                                        }
                                        </Collapse>,
                    },
                    ]}
                />
        </Sider>
                
        <VersionInputModal
            modalOpen={newVersionModalOpen}
            handleCancel={handleCancel}
            handleOk={handleNewVersion}
        />
    </div>
  )
}
