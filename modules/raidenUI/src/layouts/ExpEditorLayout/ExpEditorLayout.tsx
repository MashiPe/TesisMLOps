import { GroupOutlined } from '@ant-design/icons';
import { Button, Layout, Popover, Tabs } from 'antd'
import Sider from 'antd/es/layout/Sider'
import React, { useState } from 'react'
import { Outlet } from 'react-router-dom';
import EditorOpBar from '../../components/EditorOpBar';
import EditorSideBar from '../../components/EditorSideBar';
import MenuButton from '../../components/MenuButton';

export default function ExpEditorLayou() {
    const [opBarCollpased, setOpBarCollapsed] = useState(true);
    const [sideCollapsed, setSideCollapsed] = useState(false);


    return (
        
        <Layout style={{ minHeight: '100vh' }}>
            
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
            
            {/* <Popover
                trigger={'click'}
                onOpenChange={habldeClickChange}>
                <Button>Holi</Button>
            </Popover> */}

            <Outlet/>
        </Layout>
        
    )
}
