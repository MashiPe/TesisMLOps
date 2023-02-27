import { PlusOutlined } from '@ant-design/icons'
import { Button, Divider, Input, Select } from 'antd'
import React, { ChangeEvent, useEffect, useState } from 'react'
import InputMap from '../InputMap'
import styles from "./InputComplexMap.module.scss"

export interface InputComplexMapProps{
    value: { [key:string]: {[key:string]:string} },
    onChange: (newValue: { [key:string]: {[key:string]:string} })=>void
}


export default function InputComplexMap({value = {},onChange} : InputComplexMapProps) {
  

    // console.log(value)
    

    // console.log("ComplexMapValues",value)

    const auxTragetList:string[] = []
    const auxValue:{[key:string]:{[key:string]:string}} = {}

    Object.keys(value).map( (key)=>{
        
        auxValue[key] = {}

        Object.keys(value[key]).map( (param)=>{
            
            var aux = ''
            
            console.log("param",param)

            if ('target-columntype' === param){
                aux = value[key][param]
                auxTragetList.push(aux)
                return
            }
            
            auxValue[key][param] = value[key][param] 
            
        } )    


    } )

    // const [valueState, setValueState] = useState(value)


    const [keyPairNum, setKeyPairNum] = useState( Object.keys(auxValue).length )
    
    const [ keyList , setKeyList ] = useState<string[]>(Object.keys(auxValue))

    // const [ targetList , setTargetList ] = useState<string[]>([])
    const [ targetList , setTargetList ] = useState<string[]>(auxTragetList)
    const [ valueList , setValueList ] = useState<{[key:string]:string}[]>(Object.values(auxValue))


    function handleChange(newKeyList: string[], newValueList: {[key:string]:string}[],newTargetList:string[]){
        
        const newValue : {[key:string] : {[key:string]:string}} = {} 

        for (let i = 0; i < newKeyList.length; i++) {
            const auxValue : {[key:string]:string} ={} 

            Object.keys(newValueList[i]).map( (tempKey,index)=>{
                auxValue[tempKey] = newValueList[i][tempKey];
            } );

            
            auxValue['target-columntype'] = newTargetList[i]

            newValue[newKeyList[i]] ={...auxValue};

        }

        onChange(newValue)
    }

    function addKeyPair(){
        const auxTragetList = [...targetList]
        const auxKeyList = [...keyList]
        const auxValueList = [...valueList]

        auxTragetList.push('')
        auxKeyList.push('')
        auxValueList.push({})

        setTargetList(auxTragetList)
        setKeyList(auxKeyList)
        setValueList(auxValueList)
        setKeyPairNum(keyPairNum+1)

        handleChange(auxKeyList,auxValueList,auxTragetList)
    }

    function setTargetType(i:number,targetType:string){
        const auxTragetList = [...targetList]
        auxTragetList[i] = targetType 
        setTargetList(auxTragetList)
        handleChange(keyList,valueList,auxTragetList)
    }

    function setRowKey( i:number , newKey:string){
        
        const auxKeyList = [...keyList]
        auxKeyList[i] = newKey 
        setKeyList(auxKeyList)
        handleChange(auxKeyList,valueList,targetList)
    }

    function setRowValue( i:number , newValue:{[key:string]:string}){
        
        const auxValueList = [...valueList]
        auxValueList[i] = newValue 
        setValueList(auxValueList)
        handleChange(keyList,auxValueList,targetList)
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

                        <p key={'column-title'} >Column Target Type</p>
                        {/* <Divider key={`head-divider-${i}`} style={{padding:0}}/> */}
                        <Select

                            defaultValue={targetList[i]}

                            options={[
                                {value: 'str',label:'String'},
                                {value: 'int',label:'Integer'},
                                {value: 'number',label:'Number'},
                            ]}

                            onChange={
                                (targetType)=>{
                                    // console.log(e)
                                    // const targetType = e.target.value
                                    
                                    setTargetType(i,targetType)

                                }
                            }
                        />
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
                onClick={()=>{addKeyPair()}} ></Button>
        </div>

  )
}
