import { GroupOutlined } from '@ant-design/icons';
import { Button, Layout, Popover, Tabs } from 'antd'
import Sider from 'antd/es/layout/Sider'
import React, { useState } from 'react'
import { Outlet } from 'react-router-dom';
import EditorOpBar from '../../components/EditorOpBar';
import EditorSideBar from '../../components/EditorSideBar';
import MenuButton from '../../components/MenuButton';

export default function ExpEditorLayou() {
    const [collapsed2, setCollapsed2] = useState(false);
    const [collapsed1, setCollapsed1] = useState(false);

    function habldeClickChange( open:boolean ) {
        
        console.log(open    )
    }

    return (
        
        <Layout style={{ minHeight: '100vh' }}>
            
            <EditorSideBar collpased={collapsed1} onCollapse={setCollapsed1 } />
                
            <div>
                <EditorOpBar collapsed={collapsed2} onCollapse={setCollapsed2}></EditorOpBar>
                <MenuButton 
                    collapsed={collapsed1} 
                    onCollpase={()=>{setCollapsed1(!collapsed1)}} 
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
