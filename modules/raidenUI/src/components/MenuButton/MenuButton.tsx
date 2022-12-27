import { CaretRightOutlined } from '@ant-design/icons'
import { Button } from 'antd'
import React from 'react'
import style from "./MenuButton.module.scss"

export interface MenuButtonProps{
    collapsed:boolean,
    onCollpase:()=>void
}

export default function MenuButton({ collapsed,onCollpase }:MenuButtonProps) {
  return (
    <div className={style.menubutton}>
        <Button 
            size='large' 
            shape='circle' 
            icon={<CaretRightOutlined/>}
            onClick={onCollpase}></Button>
    </div>
  )
}
