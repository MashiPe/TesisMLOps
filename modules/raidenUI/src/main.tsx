import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { ConfigProvider, theme } from 'antd';
import { Provider } from 'react-redux';
import {store} from "./store/store";



ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
        <Provider store={store}>
            <ConfigProvider
                // theme={{

                //     algorithm: theme.darkAlgorithm,
                //     token: {
                        
                //         colorPrimary: "#44bba4",
                //         colorWarning: "#fc7a1e",
                //         colorInfo: "#8ebacf",
                //         // colorBgContainer: "#f6f7eb",
                //         // colorPrimaryBg: "#152220",
                //         // colorPrimaryBgHover : '#1b3430',
                //     }

                // }}
            >
                <App/>
            </ConfigProvider>
        </Provider>
  </React.StrictMode>,
)