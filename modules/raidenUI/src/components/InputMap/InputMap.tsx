import { PlusOutlined } from '@ant-design/icons'
import { Button, Divider, Input } from 'antd'
import React, { ChangeEvent, useState } from 'react'
import styles from "./InputMap.module.scss"

export interface InputMapProps{
    value: { [key:string]:string },
    onChange: (newValue: { [key:string]: string })=>void,
    style?: React.CSSProperties
}


export default function InputMap({value = {},onChange,style} : InputMapProps) {
  

    console.log(value)
    
    // const [valueState, setValueState] = useState(value)
    const [keyPairNum, setKeyPairNum] = useState( Object.keys(value).length )
    
    const [ valueList , setValueList ] = useState<string[]>(Object.values(value))
    const [ keyList , setKeyList ] = useState<string[]>(Object.keys(value))


    function handleChange(newKeyList: string[], newValueList: string[]){
        
        // console.log(keyList)
        // console.log(value)

        var newValue : {[key:string] : string} = {} 

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

    function setRowValue( i:number , newValue:string){
        
        const auxValueList = [...valueList]
        auxValueList[i] = newValue 
        setValueList(auxValueList)
        handleChange(keyList,auxValueList)
    }


    function renderRows(){
        const content: React.ReactNode[] = []

        for (let i = 0; i < keyPairNum; i++) {
            content.push(
                <React.Fragment key={`inputmapfragment${i}`}>
                    <Input key={`key-${i}`}  placeholder='key' onChange={ (e)=>{
                        const newKey = e.target.value
                        setRowKey(i,newKey) 
                    }} 
                        defaultValue={keyList[i]}></Input>
                    <Divider key={`div-${i}`} type='vertical' style={{margin:0, height:'100%'}}  />
                    <Input key={`value-${i}`} placeholder='value' onChange={(e)=>{
                        const newValue = e.target.value
                        setRowValue(i,newValue)
                    }}
                        defaultValue={valueList[i]}></Input>
                </React.Fragment>
            )            
        }
        
        return content
    }

    return (

        <div style={ { height:'100%',  width:'100%', ...style}}  >
            <div className={styles.inputmapcontainer}>
                
                <p key={'key-title'} >Key</p>
                <Divider key={'head-divider'} type='vertical' style={{margin:0, height:'100%'}}  />
                <p key={'value-title'}>Value</p>

                <Divider key={'divider1'} dashed style={{margin:'1%'}}></Divider>
                <Divider key={'divider2'}type='vertical' style={{margin:0, height:'100%'}}  />
                <Divider key={'divider3'}dashed style={{margin:'1%'}} ></Divider>

                {renderRows()}

            </div>
            
            <Button 
                icon={<PlusOutlined/>}
                onClick={()=>{setKeyPairNum(keyPairNum+1)}} ></Button>
        </div>

  )
}
