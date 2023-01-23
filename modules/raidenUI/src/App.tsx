import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import '@tremor/react/dist/esm/tremor.css';
import { Card, Text, Metric, Flex, ProgressBar } from "@tremor/react";
import { Outlet, useNavigate } from 'react-router';
import style from "./App.module.scss";
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import DashboardLayout from './layouts/DashboardLayout';
import ExpEditorLayout from './layouts/ExpEditorLayout'; 
import ExpCanvas from './routes/ExpCanvas';
import ExperimentsDashboard from './routes/ExperimentsDashboard';
import DatasetDashboard from './routes/DatasetsDashboard/DatasetDashboard';
import { useGetExperimentListQuery } from './store/api/flaskslice';
import { IExperiment } from './store/storetypes';
import { useAppDispatch } from './store/hooks';
import { addExperiment } from './store/slices/ExperimentsSlice/experimentsSlice';

export const baseURL = "http://localhost:4000"

function App() {
  
    // const navigate = useNavigate();

    const dispatch = useAppDispatch()
    const { data, error, isLoading } = useGetExperimentListQuery("")


    useEffect( ()=>{
        if (!isLoading){
            console.log(data)
            data?.map( (exp)=>{
                console.log(exp)
                dispatch(addExperiment(exp))
            } )
        }                
    },[isLoading] )
    
    return(
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<DashboardLayout/>}>
                    <Route path="experiments" element={<ExperimentsDashboard/>}></Route>
                    <Route path="datasets" element={<DatasetDashboard/>}></Route>
                </Route>
                <Route path="/editor" element={<ExpEditorLayout/>} >
                    <Route index element={<ExpCanvas/>}></Route>
                </Route>
            </Routes>
        </BrowserRouter>
    )

}

export default App
