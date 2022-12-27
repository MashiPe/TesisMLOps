import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
// import ProjectsDashboard from './routes/ProjectsDashboard'
// import ErrorPage from "./routes/errorpage"
// import { createRoot } from "react-dom/client";
import {
    BrowserRouter,
  createBrowserRouter,
  Route,
  RouterProvider,
  Routes,
} from "react-router-dom";
import { ConfigProvider, theme } from 'antd';
// import Root, {loader as rootLoader} from './routes/root'
// import TourDashboard from './routes/ToursDashboard'
// import UploadFileModal from './components/UpdateTourModal'
// import UpdateTourModal from './components/UpdateTourModal'
// import TourEditor from './routes/TourEditor'



ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    {/* <RouterProvider router={router} /> */}
    {/* <App /> */}
    {/* <ProjectsDashboard/> */}
    <ConfigProvider
        theme={{

            algorithm: theme.darkAlgorithm,
            token: {
                
                colorPrimary: "#44bba4",
                colorWarning: "#fc7a1e",
                colorInfo: "#8ebacf",
                // colorBgContainer: "#f6f7eb",
                // colorPrimaryBg: "#152220",
                // colorPrimaryBgHover : '#1b3430',
            }

        }}
    >
        <App/>
    </ConfigProvider>
  </React.StrictMode>,
)