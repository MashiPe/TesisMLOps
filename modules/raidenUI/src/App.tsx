import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import '@tremor/react/dist/esm/tremor.css';
import { Card, Text, Metric, Flex, ProgressBar } from "@tremor/react";
import { Outlet, useNavigate } from 'react-router';
import style from "./App.module.scss";
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import DashboardLayout from './layouts/DashboardLayout';
import MainDashboard from './routes/MainDashboard';

export const baseURL = "http://localhost:8090"

function App() {
  
    // const navigate = useNavigate();

    // useEffect(() => {
      
    //     navigate("/projects")        
    
    
    // })
    
    return(
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<DashboardLayout/>}>
                    <Route path="experiments" element={<MainDashboard/>}></Route>
                </Route>
            </Routes>
        </BrowserRouter>
    )

}

export default App
