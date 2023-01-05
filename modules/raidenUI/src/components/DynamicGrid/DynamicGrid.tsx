import { Card, Col, Row } from 'antd';
import React from 'react'
import ExperimentCard from '../ExperimentCard';
import styles from "./DynamicGrid.module.scss";

export interface DynamicGridProps{
    cols:number,
    children? : React.ReactNode;
    style?: React.CSSProperties
    className?: string,
    emptyEl?: React.ReactNode
}

const DynamicGrid: React.FC<DynamicGridProps> = ({ cols, children,style,className='',emptyEl=<Card bordered={false}/>})=>{

    const rows =  children ? Math.ceil(React.Children.count(children) / cols) : 0;

    console.log(`cols number: ${cols}`)
    console.log(`row number: ${rows}`)


    const childrenArray = React.Children.toArray(children);

    let i = -1

    return(
        <div className={`${styles.grid} ${className}` } style={style}>
            {
                // Array.from(Array(rows).keys()).map( (rowNumer)=>{
                //     return(
                        <Row gutter={[16,16]}>
                            {
                                Array.from(Array(rows*cols).keys()).map( (colNumber)=>{
                                    i++;
                                    return(
                                        <Col flex={'1 1 auto'} style={{width:'fit-content'}}>
                                            {
                                                i<childrenArray.length ? childrenArray[i] : 
                                                                        // emptyEl
                                                                        <Card style={{width:'auto'}} /> 
                                            }
                                        </Col>
                                    )

                                } )
                            }
                        </Row>
                //     )
                // } )
            }
        </div>
    )

};

export default DynamicGrid