import { Layout } from 'antd'
import Sider from 'antd/es/layout/Sider'
import React, { useState } from 'react'
import MenuButton from '../../components/MenuButton';

export default function ExpEditorLayou() {
  const [collapsed1, setCollapsed1] = useState(false);
  const [collapsed2, setCollapsed2] = useState(false);
    return (
        
    <Layout style={{ minHeight: '100vh' }}>
            
            {/* <div style={{minHeight:'75%'}}> */}

                <Sider  
                    theme='light' 
                    collapsible 
                    collapsed={collapsed1} 
                    onCollapse={(value) => setCollapsed1(value)} 
                    trigger={null}
                >
                    <MenuButton collapsed={collapsed1} onCollpase={()=>{setCollapsed1(!collapsed1)}} />
                    {/* <div style={{ height: 32, margin: 16, background: 'rgba(255, 255, 255, 0.2)' }} /> */}
                    {/* <Menu defaultSelectedKeys={['1']} mode="inline" items={items} /> */}
                </Sider>
            {/* </div> */}
            <Sider theme='light' collapsible collapsed={collapsed2} onCollapse={(value) => setCollapsed2(value)} >
                <div style={{ height: 32, margin: 16, background: 'rgba(255, 255, 255, 0.2)' }} />
                {/* <Menu defaultSelectedKeys={['1']} mode="inline" items={items} /> */}
            </Sider>
        </Layout>

    )
}
