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
import { ConfigProvider } from 'antd';
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
            token:{
                colorPrimary: '#44bbA4'
            }
        }}
    >
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<App/>}>
                    <Route></Route>
                    {/* <Route path='projects' element={<ProjectsDashboard/>}></Route>
                    <Route path="tours/:projectId/:projectName" element={<TourDashboard/>}>
                        <Route path='updatetour' element={<TourEditor/>}></Route>
                    </Route> */}
                </Route>
            </Routes>
        </BrowserRouter>
    </ConfigProvider>
  </React.StrictMode>,
)