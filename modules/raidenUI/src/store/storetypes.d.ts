import { List } from "reselect/es/types";

export interface IExperiment{
    link:string,
    name: string,
    description: string,
    versions: Map<string,IVersion>,
}

export interface IVersion{
    
    link: string,
    name: string,
    operators: Map<string,IOperator>,
    order_list: string[][],
    descriptors: Map<string,Map<string,string>>,
    io_metadata: Map<string,string>,
}

export interface IOperator{
    env: string,
    input: string[],
    op_type: string,
    output: string[],
    parameters: Map<string, string|number|Map|List > ,
}