import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import '@tremor/react/dist/esm/tremor.css';
import { Card, Text, Metric, Flex, ProgressBar } from "@tremor/react";
import { Outlet, useNavigate } from 'react-router';
import style from "./App.module.scss";
import { Link } from 'react-router-dom';

export const baseURL = "http://localhost:8090"

function App() {
  
    const navigate = useNavigate();

    // useEffect(() => {
      
    //     navigate("/projects")        
    
    
    // })
    
    return(
        <>
        <div className={style.sidebar}  id="sidebar">
            <h1>Tour Management Dashboard</h1>
            <nav>
            <ul>
                <li>
                <Link to={`projects`}>Projects</Link>
                </li>
            </ul>
            </nav>
        </div>
        <div className={style.detail} id="detail">
            <Outlet/>
        </div>
        </>
    )

}

export default App
