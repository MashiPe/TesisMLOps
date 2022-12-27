import { Col, Row } from 'antd';
import React from 'react'
import ExperimentCard from '../ExperimentCard';
import style from "./DynamicGrid.module.scss";

export interface DynamicGridProps{
    cols:number,
    children? : React.ReactNode;
}

const DynamicGrid: React.FC<DynamicGridProps> = ({ cols, children })=>{

    const rows =  children ? Math.ceil(React.Children.count(children) / cols) : 0;

    const childrenArray = React.Children.toArray(children);

    let i = -1

    return(
        <div className={style.grid}>
            {
                // Array.from(Array(rows).keys()).map( (rowNumer)=>{
                    // return(
                        <Row gutter={[16,16]}>
                            {
                                Array.from(Array(rows*cols).keys()).map( (colNumber)=>{
                                    i++;
                                    return(
                                        <Col flex={1} >
                                            {
                                                i<childrenArray.length ? childrenArray[i] : <div/> 
                                            }
                                        </Col>
                                    )

                                } )
                            }
                        </Row>
                    // )
                // } )
            }
        </div>
    )

};

export default DynamicGrid