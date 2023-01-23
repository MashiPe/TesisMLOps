import { PlusOutlined } from '@ant-design/icons'
import { Button, Divider, Input } from 'antd'
import React, { ChangeEvent, useState } from 'react'
import InputMap from '../InputMap'
import styles from "./InputComplexMap.module.scss"

export interface InputComplexMapProps{
    value: { [key:string]: {[key:string]:string} },
    onChange: (newValue: { [key:string]: {[key:string]:string} })=>void
}


export default function InputComplexMap({value = {},onChange} : InputComplexMapProps) {
  

    // console.log(value)
    
    // const [valueState, setValueState] = useState(value)

    console.log("ComplexMapValues",value)

    const [keyPairNum, setKeyPairNum] = useState( Object.keys(value).length )
    
    const [ keyList , setKeyList ] = useState<string[]>(Object.keys(value))
    const [ valueList , setValueList ] = useState<{[key:string]:string}[]>(Object.values(value))


    function handleChange(newKeyList: string[], newValueList: {[key:string]:string}[]){
        
        // console.log(keyList)
        // console.log(value)

        var newValue : {[key:string] : {[key:string]:string}} = {} 

        for (let i = 0; i < newKeyList.length; i++) {
            newValue[newKeyList[i]] = newValueList[i];
        }

        onChange(newValue)
    }

    function setRowKey( i:number , newKey:string){
        
        const auxKeyList = [...keyList]
        auxKeyList[i] = newKey 
        setKeyList(auxKeyList)
        handleChange(auxKeyList,valueList)
    }

    function setRowValue( i:number , newValue:{[key:string]:string}){
        
        const auxValueList = [...valueList]
        auxValueList[i] = newValue 
        setValueList(auxValueList)
        handleChange(keyList,auxValueList)
    }


    function renderContent(){
        const content: React.ReactNode[] = []

        for (let i = 0; i < keyPairNum; i++) {
            content.push(
                <React.Fragment key={`frag-${i}`}>
                    <div>
                        <p key={'key-title'} >Column Name</p>
                        {/* <Divider key={`head-divider-${i}`} style={{padding:0}}/> */}
                        <Input key={`mapkey-${i}`} value={keyList[i]} onChange={ (e)=>{
                            const newKey = e.target.value

                            setRowKey(i,newKey)
                        } } />
                    </div>
                    
                    <div > 
                    
                        <InputMap
                        key={`mapValue-${i}`} value={valueList[i]} onChange={ (e)=>{
                            const newValue = e

                            setRowValue(i,newValue)
                        } }/>
                    </div>

                </React.Fragment>
            )            
        }
        
        return content
    }

    return (

        <div style={ { height:'100%',  width:'100%'}}  >
            <div className={styles.inputmapcontainer}>
                
                {
                    renderContent()
                }

            </div>
            
            <Button 
                icon={<PlusOutlined/>}
                onClick={()=>{setKeyPairNum(keyPairNum+1)}} ></Button>
        </div>

  )
}
