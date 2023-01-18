import { List } from "reselect/es/types";

export interface IExperiment{
    link:string,
    name: string,
    description: string,
    versions: {[key:string]:IVersion},
}

export interface IVersion{
    
    link: string,
    name: string,
    operators: {[key:string]:IOperator},
    order_list: string[][],
    descriptors: {[key:string]:{[key:string]:string}},
    io_metadata: {[key:string]:string},
    datasetList: string[],
    modelList: string[],
    graphList: string[]
}

export interface IOperator{
    env: string,
    input: string[],
    op_type: string,
    output: string[],
    parameters: {[key:string]: string|number|{[key:any]:any}|List } ,
}


export interface OperatorDefinition{
    inputDef : InputDefinition,
    outputDef: OutputDefinition,
    paramsDef : ParamsDefinition[]
}

export interface InputDefinition{
    datasetInputs : number
    modelInputs: number   
}
export interface OutputDefinition{
    datasetOutput : number
    modelOutputs: number
    graphicsOutput: number   
}

export interface ParamsDefinition{
    name:string,
    type: 'list'| 'string'| 'number'|'map'|'complexMap',
    constrains: { [key:string]: string }
}

export interface IDataset{
    name:string,
    // metadata:string,
    versions: DatasetVersion[]
}

export interface DatasetVersion{
    name:string,
    tableName:string,
    preview: Preview
}

export interface Preview{
    meta: MetaRecord[],
    records: {[key:string]:string|number}[]
}

export interface MetaRecord{
    title: string,
    dataIndex: string,
    key: string
}