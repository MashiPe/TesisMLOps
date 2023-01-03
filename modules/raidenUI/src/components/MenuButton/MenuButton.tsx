import { CaretRightOutlined } from '@ant-design/icons'
import { Button } from 'antd'
import React from 'react'
import styles from "./MenuButton.module.scss"

export interface MenuButtonProps{
    collapsed:boolean,
    onCollpase:()=>void,
    icon: React.ReactNode,
    style?: React.CSSProperties
}

export default function MenuButton({ collapsed,onCollpase,icon, style}:MenuButtonProps) {
  return (
    <div className={styles.menubutton} style={style}>
        <Button 
            size='large' 
            shape='default' 
            icon={icon}
            onClick={onCollpase}
            type={ collapsed? 'default' : 'primary'}></Button>
    </div>
  )
}
