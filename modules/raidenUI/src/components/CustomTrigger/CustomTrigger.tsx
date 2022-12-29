
import { DoubleLeftOutlined, DoubleRightOutlined } from '@ant-design/icons'
import React from 'react'
import style from "./CustomTrigger.module.scss"

export interface CustomTriggerProps{
    className: string,
    collpased: boolean,
    onCollapse: ()=>void,
}

export default function CustomTrigger( {className = '', collpased ,onCollapse}:CustomTriggerProps) {
  return (

    <div
        onClick={onCollapse}
        className={ ` ${style.trigger} ${className}` }>
            {
                collpased? <DoubleRightOutlined/> : <DoubleLeftOutlined/>
            }
    </div>
  )
}
