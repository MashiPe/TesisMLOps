import { PlusOutlined } from '@ant-design/icons'
import { Button, Input } from 'antd'
import React, { ChangeEvent, useState } from 'react'
import styles from "./InputList.module.scss"

export interface InputListProps{
    value: string[],
    onChange: (newValues: string[])=>void, 
}

export default function InputList({value = [],onChange}:InputListProps) {
 
    const [numElements, setNumElements] = useState(value.length)
    const [elementsState, setElements] = useState(value)

    function handleChange(e : React.ChangeEvent<HTMLInputElement>,i: number){
        
        const newValue = e.target.value

        var auxElements = [...elementsState]

        auxElements[i] = newValue
        
        onChange(auxElements)
        setElements(auxElements)

    }

    function renderListInputs() {
        const elements: React.ReactNode[] = []

        for (let i = 0; i < numElements; i++) {

            elements.push(
                <Input 
                    key={`lel${i}`}
                    style={{width:'3em'}}
                    onChange={(e)=>{handleChange(e,i)}}
                    defaultValue={elementsState[i]}></Input>
            )
            
        }

        return elements
    }

    return (
        <div style={ { height:'100%',  width:'100%'}}  >
            <div className={styles.inputlistcontainer}>
                
                {renderListInputs()}

            </div>
            
            <Button 
                style={{marginTop:'1em'}}
                icon={<PlusOutlined/>}
                onClick={()=>{setNumElements(numElements+1)}} ></Button>
        </div>

    )
}
