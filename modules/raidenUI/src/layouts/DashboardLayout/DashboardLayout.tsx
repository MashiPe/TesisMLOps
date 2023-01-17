import React, { useEffect, useState } from 'react';
import {
  DesktopOutlined,
  FileOutlined,
  PieChartOutlined,
  ReconciliationFilled,
  ReconciliationOutlined,
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Breadcrumb, Layout, Menu, theme } from 'antd';
import style from "./DashboardLayout.module.scss"
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import ExperimentCard from '../../components/ExperimentCard/ExperimentCard';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
// import { selectCurrentExpLink, setCurrentExp } from '../../store/slices/CurrentExp/currentExpSlice';


const { Header, Content, Footer, Sider } = Layout;

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
  getItem(<Link to={"experiments"}>Experiments</Link>, '1', <PieChartOutlined />),
  getItem(<Link to={"datasets"}>Datasets</Link>, '2', < ReconciliationOutlined/>),
];

const DashboardLayout: React.FC = () => {
    const [collapsed, setCollapsed] = useState(false);
    const {
        token: { colorBgContainer },
    } = theme.useToken();

    const location = useLocation();
    const navigation = useNavigate();
    
    // const expLink = useAppSelector(selectCurrentExpLink);
    const dispatch = useAppDispatch();



    useEffect(() => {
        
        if(location.pathname == '/')
            navigation('/experiments')        
    })
    

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Sider theme='light' collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)} >
                <div style={{ height: 32, margin: 16, background: 'rgba(255, 255, 255, 0.2)' }} />
                <Menu defaultSelectedKeys={['1']} mode="inline" items={items} style={{border:0}}/>
            </Sider>
            <Layout>
                <Header style={{ padding: 0, background: colorBgContainer }} />
                <Content>
                    <Outlet></Outlet>
                    {/* <Breadcrumb style={{ margin: '16px 0' }}>
                        <Breadcrumb.Item>User</Breadcrumb.Item>
                        <Breadcrumb.Item>Bill</Breadcrumb.Item>
                    </Breadcrumb>
                    <div className={style.txt} style={{ padding: 24, background: colorBgContainer }}>
                        Bill is a cat.
                    </div> */}
                </Content>
            </Layout>
            

        </Layout>
    );
};

export default DashboardLayout;