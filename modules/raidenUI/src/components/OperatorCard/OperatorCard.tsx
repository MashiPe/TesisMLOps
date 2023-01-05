import { EditOutlined } from '@ant-design/icons';
import { ColGrid } from '@tremor/react';
import { Avatar, Button, Card, Space } from 'antd'
import React from 'react'
import DynamicGrid from '../DynamicGrid';
import styles from "./OperatorCard.module.scss";

const {Meta} = Card;

export default function OperatorCard() {
  return (
  
    // <div>
        <Card 
            // bordered={false} 
            // headStyle={{borderBottom:0}} 
            bodyStyle={{overflow:'auto',height:'15vh',padding:'2%'} }
            style={{minHeight:'15vh' }}
            // extra= {<Button type='primary' icon={<CaretRightOutlined/>} >Abrir</Button>}
            >
                <div className={styles.content}>
                        {/* asdasd */}
                        <Meta
                            // className={}
                            style={{maxWidth:'15vw', whiteSpace:'break-spaces'}}
                            avatar={<Avatar src="https://joeschmoe.io/api/v1/random" />}
                            title="Operator Title"
                            // description="This is the description"
                        />
                            
                        <div className={styles.params}>
                            <ColGrid numColsMd={2}>
                                <h3 style={{margin:'0',width:'fit-content'}}>param:value</h3>
                                <h3 style={{margin:'0',width:'fit-content'}}>param:value</h3>
                                <h3 style={{margin:'0',width:'fit-content'}}>param:value</h3>
                                <h3 style={{margin:'0',width:'fit-content'}}>param:value</h3>
                                <h3 style={{margin:'0',width:'fit-content'}}>param:value</h3>
                                <h3 style={{margin:'0',width:'fit-content'}}>param:value</h3>
                                <h3 style={{margin:'0',width:'fit-content'}}>param:value</h3>
                                <h3 style={{margin:'0',width:'fit-content'}}>param:value</h3>
                                <h3 style={{margin:'0',width:'fit-content'}}>param:value</h3>
                                <h3 style={{margin:'0',width:'fit-content'}}>param:value</h3>
                                <h3 style={{margin:'0',width:'fit-content'}}>param:value</h3>
                                <h3 style={{margin:'0',width:'fit-content'}}>param:value</h3>
                                <h3 style={{margin:'0',width:'fit-content'}}>param:value</h3>
                                <h3 style={{margin:'0',width:'fit-content'}}>param:value</h3>
                                <h3 style={{margin:'0',width:'fit-content'}}>param:value</h3>
                                <h3 style={{margin:'0',width:'fit-content'}}>param:value</h3>
                                <h3 style={{margin:'0',width:'fit-content'}}>param:value</h3>
                                <h3 style={{margin:'0',width:'fit-content'}}>param:value</h3>
                                <h3 style={{margin:'0',width:'fit-content'}}>param:value</h3>
                                <h3 style={{margin:'0',width:'fit-content'}}>param:value</h3>
                                <h3 style={{margin:'0',width:'fit-content'}}>param:value</h3>
                                <h3 style={{margin:'0',width:'fit-content'}}>param:value</h3>
                                <h3 style={{margin:'0',width:'fit-content'}}>param:value</h3>
                                <h3 style={{margin:'0',width:'fit-content'}}>param:value</h3>
                                <h3 style={{margin:'0',width:'fit-content'}}>param:value</h3>
                                <h3 style={{margin:'0',width:'fit-content'}}>param:value</h3>
                            </ColGrid>
                        </div>                                
                                
                        <Button className={styles.last} type='primary' icon={<EditOutlined/>}>Edit</Button>
                </div>
        </Card>
    // </div>
  )
}
