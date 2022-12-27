import { Layout, Tabs } from 'antd'
import Sider from 'antd/es/layout/Sider'
import React, { useState } from 'react'
import EditorSideBar from '../../components/EditorSideBar';
import MenuButton from '../../components/MenuButton';

export default function ExpEditorLayou() {
    const [collapsed2, setCollapsed2] = useState(false);
    const [collapsed1, setCollapsed1] = useState(false);

    return (
        
    <Layout style={{ minHeight: '100vh' }}>
            
            {/* <div style={{minHeight:'75%'}}> */}
            <EditorSideBar collpased={collapsed1} onCollapse={setCollapsed1 } />
            {/* </div> */}
            <Sider theme='light' collapsible collapsed={collapsed2} onCollapse={(value) => setCollapsed2(value)} >
                <div style={{ height: 32, margin: 16, background: 'rgba(255, 255, 255, 0.2)' }} />
                {/* <Menu defaultSelectedKeys={['1']} mode="inline" items={items} /> */}
            </Sider>
                    <MenuButton collapsed={collapsed1} onCollpase={()=>{setCollapsed1(!collapsed1)}} />
        </Layout>

    )
}
