export interface IExperiment{
    link:string,
    name: string,
    description: string,
    operators: { [key:string]:IOperator},
    order_list: string[][],
    descriptors: {[key:string]:{[key:string]:string}},
    io_metadata: { [key:string]:string}
}

export interface IOperator{
    env: string,
    input: string[],
    op_type: string,
    output: string[],
    parameters: Map,
}