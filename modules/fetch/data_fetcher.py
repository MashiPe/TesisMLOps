from SPARQLWrapper import SPARQLWrapper,GET ,POST,JSON
import json
import os
from typing import Dict, List
import re

GRAPHDB_HOST = 'http://localhost:7200'
DEFAUL_REPO = 'mashitesis'
MLOPS_PREFIX = 'http://www.semanticweb.org/DM/ontologies/MLOpsExp#'


# sparql = SPARQLWrapper(
#     "http://localhost:7200/repositories/mashitesis"
# )
# sparql.setReturnFormat(JSON)

# # gets the first 3 geological ages
# # from a Geological Timescale database,
# # via a SPARQL endpoint
# sparql.setQuery("""
#     PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
#     PREFIX DMProcess:<http://www.semanticweb.org/DM/ontologies/DMProcess.owl#>

#     select ?operators where {
#         DMProcess:Iris_SVM_Experiment DMProcess:has_resource ?operators .
#     }
#     """
# )

# try:
#     ret = sparql.queryAndConvert()

#     for r in ret["results"]["bindings"]:
#         print(r)
# except Exception as e:
#     print(e)


query_template_paths = {
    'exp_info' : 'fetch/querys/fetch/fetch_experiment_inf.rq',
    'version_info' : 'fetch/querys/fetch/fetch_version_inf.rq',
    'version_ops' : 'fetch/querys/fetch/fetch_version_ops.rq',
    'type' : 'fetch/querys/fetch/fetch_type.rq',
    'op_in' : 'fetch/querys/fetch/fetch_operator_input.rq',
    'op_out' : 'fetch/querys/fetch/fetch_operator_output.rq',
    'op_param' : 'fetch/querys/fetch/fetch_operator_param.rq',
    'param_name_value' : 'fetch/querys/fetch/fetch_param_name_value.rq',
    'direct_value' : 'fetch/querys/fetch/fetch_direct_value.rq',
    'list_element' : 'fetch/querys/fetch/fetch_list_elements.rq',
    'keyvalue_element' : 'fetch/querys/fetch/fetch_keyvalue_elements.rq',
    'dependencies' : 'fetch/querys/fetch/fetch_dependencies.rq',
    'env': 'fetch/querys/fetch/fetch_operator_env.rq',
    'iodescriptor':'fetch/querys/fetch/fetch_ioobject_descriptor.rq',
    'des_attributes': 'fetch/querys/fetch/fetch_descriptor_attributes.rq',
    'attr_info':'fetch/querys/fetch/fetch_attribute_info.rq',
    'new_exp':'fetch/querys/insert/insert_new_experiment.rq',
    'new_dataset':'fetch/querys/insert/insert_new_dataset.rq',
    'exp_list':'fetch/querys/fetch/fetch_experiment_list.rq',
    'dataset_list':'fetch/querys/fetch/fetch_dataset_list.rq',
    'dataset_version_list':'fetch/querys/fetch/fetch_dataset_version.rq',
    'new_data_version':'fetch/querys/insert/insert_new_dataset_version.rq',
    'set_meta':'fetch/querys/insert/set_metadata.rq',
    'exp_version_list':'fetch/querys/fetch/fetch_exp_version_list.rq',
    'new_exp_version':'fetch/querys/insert/insert_new_experiment_version.rq',
    'new_operator':'fetch/querys/insert/insert_new_operator.rq',
    'set_op_input':'fetch/querys/insert/insert_operator_input.rq',
    'set_op_output':'fetch/querys/insert/insert_operator_output.rq',
    'set_op_param':'fetch/querys/insert/insert_operator_parameter.rq',
    'set_param_value':'fetch/querys/insert/insert_parameter_value.rq',
    'set_direct_value':'fetch/querys/insert/set_direct_value.rq',
    'set_env':'fetch/querys/insert/set_operator_env.rq',
    'set_direct_value':'fetch/querys/insert/set_direct_value.rq',
    'insert_list_el':'fetch/querys/insert/insert_list_element.rq',
    'insert_keyvalue_el':'fetch/querys/insert/insert_keyvalue_element.rq',
    'add_table_attr':'fetch/querys/insert/insert_tableformat_attribute.rq',
    'delete_entity':'fetch/querys/delete/delete_conections.rq'
}

type_mapin ={
    "float64":"DMProcess:64Float",
    "float32":"DMProcess:32Float",
    "object":"DMProcess:iString",
    "int64":"DMProcess:64Int",
    "int32":"DMProcess:32Int"
}


def load_query_template(template: str = ''):

    query = ''
    template_path = query_template_paths[template]

    with open(template_path,'r') as query_template:
        query = query_template.read()

    return query

class DataFetcher():

    def __init__(self,host:str = GRAPHDB_HOST , repo: str = DEFAUL_REPO) -> None:
        
        print(os.getcwd())
        self.fetch_endpoint = "{}/repositories/{}".format(host,repo)
        self.post_endpoint = "{}/repositories/{}/statements".format(host,repo)

        fetch_conn = SPARQLWrapper(
            self.fetch_endpoint
        )
        fetch_conn.setReturnFormat(JSON)
        fetch_conn.addParameter("infer","false")

        post_conn = SPARQLWrapper(
            self.post_endpoint
        )
        post_conn.setReturnFormat(JSON)
        post_conn.addParameter("infer","false")

        self.fetch_conn = fetch_conn
        self.post_conn = post_conn

    def delete_for_update(self,entity_IRI:str,format_iri=True):
        query_str = load_query_template('delete_entity')

        try:
            if format_iri:
                query_str = query_str.replace("@subject","<{}>".format(entity_IRI))
            else:
                query_str = query_str.replace("@subject",entity_IRI)
            self.post_conn.setQuery(query_str)
            self.post_conn.setMethod =(POST)
            print("Executing delete",query_str)
            self.post_conn.queryAndConvert()
            return True
        except:
            return False

    def delete_op(self,op_name:str):
        
        op_iri = "MLOps:{}".format(op_name.replace(" ","").lower())

        return self.delete_for_update(op_iri,format_iri=False)

    def execute_fetch(self,query_type:str,entry_vars:Dict,output_vars: List)->List[Dict]:

        query_str = load_query_template(query_type)

        for var_name in entry_vars:

            reg=r'(\?{})\b'.format(var_name)

            query_str = re.sub(reg,'<{}>'.format(entry_vars[var_name]),query_str)
            # query_str = query_str.replace('?{}'.format(var_name),'<{}>'.format(entry_vars[var_name]))

        self.fetch_conn.setQuery(query_str)
        self.fetch_conn.setMethod =(GET)

        res_list = []

        try:
            print("Executing fetch",query_str)
            ret = self.fetch_conn.queryAndConvert()

            for r in ret["results"]["bindings"]:
                
                res_list.append({})

                for out_var in output_vars:
                   res_list[-1][out_var] = r[out_var]['value']
        
            return res_list
        except Exception as e:
            print(e)
            raise e
            # return e

    def execute_post(self,query_type:str,entry_vars:Dict):

        query_str = load_query_template(query_type)

        for var_name in entry_vars:
            
            reg=r'(\?{})\b'.format(var_name)

            query_str = re.sub(reg,entry_vars[var_name],query_str)

        self.post_conn.setQuery(query_str)
        self.post_conn.setMethod =(POST)

        try:
            print("Executing inser",query_str)
            ret = self.post_conn.queryAndConvert()

            return ret
        except Exception as e:
            print(e)
            raise e
    
    def post_new_dataset(self,dataset):
        dataset_info = {}

        dataset_info['dataset'] = "MLOps:{}".format(dataset['name'].replace(" ","").lower())
        dataset_info['name'] = "\"{}\"".format(dataset['name'])

        try:
            self.execute_post('new_dataset',dataset_info)
            dataset['link'] = "{}/{}".format(MLOPS_PREFIX,dataset['name'].replace(" ","").lower())
            return dataset
        except Exception as e:
            print(e)
            raise e

    def post_new_exp(self,exp):
        exp_info = {}

        exp_info['experiment'] = "MLOps:{}".format(exp['name'].replace(" ","").lower())
        exp_info['name'] = "\"{}\"".format(exp['name'])
        exp_info['description']= "\"{}\"".format(exp['description'])

        try:
            self.execute_post('new_exp',exp_info)
            exp['link'] = "{}/{}".format(MLOPS_PREFIX,exp_info['experiment'])
            return exp
        except Exception as e:
            print(e)
            raise e

    def post_new_exp_version(self,exp_iri: str,version_info):
        
        post_info = {} 
        
        post_info['experiment'] = "<{}>".format(exp_iri)
        post_info['version']= "MLOps:{}".format(version_info['name'].replace(" ","").lower())
        post_info['name']= '\"{}\"'.format(version_info['name'])

        try:
            self.execute_post('new_exp_version',post_info)

            version_dic ={ 
                "link": '{}{}'.format(MLOPS_PREFIX,version_info['name'].replace(" ","").lower()),
                "version_name": version_info['name'],
                "operators": {},
                "order_list":[],
                "descriptors":{},
                "io_metadata":{},
                "datasetList":[],
                "modelList":[],
                "graphList":[]
            }

            return version_dic
        
        except Exception as e:
            print(e)
            raise e

        pass

    def fetch_experiment_list(self):

        
        exp_list = self.execute_fetch('exp_list',{},['IRI','name','description'])
        
        formated_res = []

        for exp_entry in exp_list:
            formated_res.append({})
            
            formated_res[-1]['link']=exp_entry['IRI']
            formated_res[-1]['description']=exp_entry['description']
            formated_res[-1]['name']=exp_entry['name']

        return formated_res

    def fetch_dataset_list(self):

        # Fetching all the datasets from graphdb
        dataset_list = self.execute_fetch('dataset_list',{},['IRI','name'])
        
        formated_res = []

        for dataset_entry in dataset_list:
            formated_res.append({})
            
            formated_res[-1]['link']=dataset_entry['IRI']
            formated_res[-1]['name']=dataset_entry['name']
            formated_res[-1]['versions']=[]
        
        for i,_ in enumerate(formated_res):
            
            in_dic = { 'dataset': formated_res[i]['link'] }

            dataversion_list = self.execute_fetch(
                                    'dataset_version_list',
                                    in_dic,
                                    ['dataset_version','table_format','data_table','name'])
            
            for datasetversion_entry in dataversion_list:
            
                # dataversion_descriptor = self.execute_fetch(
                #                             'iodescriptor',
                #                             {'ioobject':datasetversion_entry['table_format']},
                #                             ['metadata'])
                
                descriptor_attributes = self.execute_fetch(
                                            'des_attributes',
                                            {'descriptor': datasetversion_entry['table_format']},
                                            ['attribute'])

                version_meta =[] 

                for attribute in descriptor_attributes:

                    attribute_info = self.execute_fetch(
                                            'attr_info',
                                            {'attribute':attribute['attribute']},
                                            ['name','possibleType'])
                    
                    version_meta.append( {
                        'title':attribute_info[0]['name'],
                        'dataIndex':attribute_info[0]['name'],
                        'key':attribute_info[0]['name']
                    } )

                version = {
                    'version_name': datasetversion_entry['name'],
                    'tableName': datasetversion_entry['data_table'],
                    'preview':{'meta':version_meta,'records':{}} #Empty records because is up to the client to ask for the data table
                }

                formated_res[i]['versions'].append(version)

        return formated_res

    def post_operator(self,version_iri:str,op_info:Dict):
        
        in_dic = {}

        op_iri = "MLOps:{}".format(op_info['name'].replace(" ","").lower())

        in_dic['operator']= op_iri 
        in_dic['type'] = "DMProcess:{}".format(op_info['type'])
        in_dic['version']= "<{}>".format(version_iri)

        self.execute_post('new_operator',in_dic)
        self.execute_post('set_env',{'operator':op_iri,'env':"\"{}\"".format(op_info['env'])})

        for i,_ in enumerate(op_info['input']):
            in_dic = {}
            in_dic['operator'] = op_iri
            in_dic['input'] = "MLOps:{}".format(op_info['input'][i].replace(" ","").lower())

            match op_info['input_type'][i]:
                case 'dataset':
                    in_dic['type'] = "DMProcess:DataTable"
                case 'model':
                    in_dic['type'] = "DMProcess:Model"
        
            self.execute_post("set_op_input",in_dic)

        for i,_ in enumerate(op_info['output']):
            in_dic = {}
            in_dic['operator'] = op_iri
            in_dic['output'] = "MLOps:{}".format(op_info['output'][i].replace(" ","").lower())

            match op_info['output_type'][i]:
                case 'dataset':
                    in_dic['type'] = "DMProcess:DataTable"
                case 'model':
                    in_dic['type'] = "DMProcess:Model"
                case 'graph':
                    in_dic['type'] = "DMProcess:Graph"
        
            self.execute_post("set_op_output",in_dic)

        op_params = op_info['parameters']

        for param_name in op_params: 
            
            param_iri = 'MLOps:{}'.format(param_name.replace(" ","").lower())

            in_dic = {}
            in_dic['parameter']= param_iri
            in_dic['operator'] = op_iri

            self.execute_post('set_op_param',in_dic)

            self.post_param_value(param_iri,param_name,op_params[param_name])

        return_op = {}

        return_op['env']=op_info['env']
        return_op['input']=op_info['input']
        return_op['output']=op_info['output']
        return_op['op_type']=op_info['type']
        return_op['op_name']=op_info['name']
        return_op['parameters']=op_info['parameters']

        return op_info

    def insert_values_param_value(self,param_name:str,param_type:str,param_value_iri:str,param_value):
        
        match param_type:
            case 'DirectValue':
                in_dic= {}
                in_dic['parameter_value'] = param_value_iri
                in_dic['value']= "\"{}\"".format(param_value)
                self.execute_post('set_direct_value',in_dic)
                return
            case 'List':
                in_dic = {}
                
                i=0
                for list_el in param_value:
                    if(type(list_el)==str or type(list_el) == int or type(list_el) == float):
                        el_type = 'DirectValue'                    
                    elif(type(list_el)==list):
                        el_type = 'List'                    
                    elif(type(list_el) == dict):
                        el_type = 'KeyValueCollection'                    

                    el_name = "{}-el-{}".format(param_name,i)
                    el_iri="MLOps:{}".format(el_name)
                    i=i+1

                    in_dic = {}
                    in_dic['list']=param_value_iri
                    in_dic['list_el'] = el_iri
                    in_dic['type'] = "DMProcess:{}".format(el_type)

                    self.execute_post('insert_list_el',in_dic)
                    self.insert_values_param_value(el_name,el_type,el_iri,list_el)
            case 'KeyValueCollection':
                in_dic = {}
                for el_key in param_value:
                    el_value = param_value[el_key]
                    if(type(el_value)==str or type(el_value) == int or type(el_value) == float):
                        el_type = 'DirectValue'                    
                    elif(type(el_value)==list):
                        el_type = 'List'                    
                    elif(type(el_value) == dict):
                        el_type = 'KeyValueCollection'                    
                    
                    el_name = "{}-k{}".format(param_name,el_key)
                    el_iri="MLOps:{}".format(el_name)
            
                    in_dic['keyvalue_collection']=param_value_iri
                    in_dic['keyvalue_element']= el_iri

                    self.execute_post('insert_keyvalue_el',in_dic)

                    value_name= "{}-v".format(el_name)
                    value_iri= "MLOps:{}".format(value_name)
                    in_dic={}
                    in_dic['keyvalue_element']= el_iri
                    in_dic['key'] = '\"{}\"'.format(el_key)
                    in_dic['value'] = value_iri
                    in_dic['type'] = "DMProcess:{}".format(el_type)

                    self.insert_values_param_value(value_name,el_key,value_iri,el_value)

    def post_param_value(self,param_iri:str,param_name,param_value):
        
        param_value_iri ="MLOps:{}-value".format(param_name.replace(" ","").lower())
        in_dic={}
        in_dic['parameter']=param_iri
        in_dic['parameter_name']="\"{}\"".format(param_name)
        in_dic['parameter_value']=param_value_iri
        if(type(param_value)==str or type(param_value)==float or type(param_value)==int):
            in_dic['parameter_type']="DMProcess:DirectValue"
            param_type = 'DirectValue'
        elif(type(param_value)==list):
            in_dic['parameter_type']="DMProcess:List"
            param_type = 'List'
        elif(type(param_value)==dict):
            in_dic['parameter_type']="DMProcess:KeyValueCollection"
            param_type = 'KeyValueCollection'

        self.execute_post('set_param_value',in_dic)

        self.insert_values_param_value(param_name,param_type,param_value_iri,param_value)
        
        return  

    def post_new_dataset_version(self,version_dic:Dict):

        version_info = {}

        # Setting basic info

        version_info['version_name']= version_dic['dataversion_name']
        version_info['tableName']= version_dic['data_table']

        dataversion_in = {
            'dataset': '<{}>'.format(version_dic['dataset']),
            'dataset_version': 'MLOps:{}'.format(version_dic['data_table']),
            'name': '\"{}\"'.format(version_dic['dataversion_name']),
            'data_table':"\"{}\"".format(version_dic['data_table'])
        }

        self.execute_post('new_data_version',dataversion_in)

        # Setting descriptor info plus building preview

        preview = {"meta":[]}

        descriptor_in ={
            'descriptor': "MLOps:{}".format(version_dic['data_table']+"-descriptor"),
            "type":"DMProcess:TableFormat",
            'ioobject': 'MLOps:{}'.format(version_dic['data_table']),
        }
        self.execute_post('set_meta',descriptor_in)
        
        for column in version_dic['columns']:

            preview['meta'].append({
                "title":column['name'],
                "dataIndex":column['name'],
                "key":column['name']
                })

            column_in = {
                "tableatr": 'MLOps:{}'.format(column['name']+"-atr"),
                "atrname": '\"{}\"'.format(column['name']),
                "atrtype": type_mapin[str(column['type'])],
                'tableformat': "MLOps:{}".format(version_dic['data_table']+"-descriptor")
            }
            self.execute_post('add_table_attr',column_in)
        
        version_info['preview'] = preview

        return version_info

    def fetch_experiment(self,experiment:str = ''):

        experiment_dic = {}

        exp_basic_info = self.execute_fetch('exp_info',{'experiment':experiment},['name'])

        experiment_dic['name'] = exp_basic_info[0]['name']

        version_list = self.execute_fetch(
                            'exp_version_list',
                            {'experiment':experiment},
                            ['version','name'])
        
        experiment_dic['versions'] = {}

        for version in version_list:
            experiment_dic['versions'][version['name']]=version['version']

        return experiment_dic


    def fetch_version_info(self,version:str = ''): 
        experiment_dic = {}

        info_query = load_query_template('version_info')

        info_query = info_query.replace('?version','<{}>'.format(version))

        # print(info_query)

        self.fetch_conn.setQuery(info_query)

        try:
            ret = self.fetch_conn.queryAndConvert()

            for r in ret["results"]["bindings"]:
                experiment_dic['version_name'] = r['name']['value']
                print(r)

        except Exception as e:
            print(e)


        ops_query = load_query_template('version_ops')

        ops_query = ops_query.replace('?version','<{}>'.format(version))

        self.fetch_conn.setQuery(ops_query)
            
        op_dic = {}

        order_list = []

        io_metadata = {}
        aux_io_metadata={}

        try:
            ret = self.fetch_conn.queryAndConvert()

            for r in ret["results"]["bindings"]:
                
                op_IRI = r['operator']['value']               

                # decoded_op = {}

                # Getting all inputs for operator
                in_query = load_query_template('op_in')

                in_query = in_query.replace('?operator','<{}>'.format(op_IRI))

                self.fetch_conn.setQuery(in_query)
                
                aux_ret = self.fetch_conn.queryAndConvert()

                in_list = []                

                for aux_r in aux_ret['results']['bindings']:
                    in_list.append(aux_r['input']['value'])


                # Getting all outputs for operator
                out_query = load_query_template('op_out')

                out_query = out_query.replace('?operator','<{}>'.format(op_IRI))

                self.fetch_conn.setQuery(out_query)
                
                aux_ret = self.fetch_conn.queryAndConvert()

                out_list = []                

                for aux_r in aux_ret['results']['bindings']:
                    out_list.append(aux_r['output']['value'])

                
                # Getting operator type
                type_query = load_query_template('type')

                type_query = type_query.replace('?entity','<{}>'.format(op_IRI))

                self.fetch_conn.setQuery(type_query)
                
                aux_ret = self.fetch_conn.queryAndConvert()

                op_type = aux_ret['results']['bindings'][0]['type']['value'].split('#')[-1]


                # Getting operator env
                env_query = load_query_template('env')

                env_query = env_query.replace('?operator','<{}>'.format(op_IRI))

                self.fetch_conn.setQuery(env_query)
                
                aux_ret = self.fetch_conn.queryAndConvert()

                op_env = aux_ret['results']['bindings'][0]['env']['value'].split('#')[-1]
                

                # Getting operator parameters
                param_query = load_query_template('op_param')

                param_query = param_query.replace('?operator','<{}>'.format(op_IRI))

                self.fetch_conn.setQuery(param_query)
                
                aux_ret = self.fetch_conn.queryAndConvert()

                param_dic = {}                

                for aux_r in aux_ret['results']['bindings']:

                    param_IRI = aux_r['parameter']['value']

                    param_name_value_query = load_query_template('param_name_value')

                    param_name_value_query= param_name_value_query.replace('?parameter','<{}>'.format(param_IRI))

                    self.fetch_conn.setQuery(param_name_value_query)
                    
                    ret_param = self.fetch_conn.queryAndConvert()

                    param_name = ret_param['results']['bindings'][0]['name']['value']
                    param_value_IRI = ret_param['results']['bindings'][0]['value']['value']


                    formated_value = self.decode_value(param_value_IRI)
                
                    param_dic[param_name] = formated_value
                

                op_dic[op_IRI.split('#')[-1]] = {
                    'parameters' : param_dic,
                    'input' : [ in_el.split('#')[-1] for in_el in in_list ],
                    'output' : [ out_el.split('#')[-1] for out_el in out_list ],
                    'op_type' : op_type,
                    "env":op_env
                }

                # Getting operator dependencies

                op_name = op_IRI.split('#')[-1]

                dependencie_query = load_query_template('dependencies')

                for input in in_list:    
                
                    aux_query = dependencie_query.replace('?output','<{}>'.format(input))

                    self.fetch_conn.setQuery(aux_query)
                    
                    aux_ret = self.fetch_conn.queryAndConvert()

                    for aux_r in aux_ret['results']['bindings']:
                        depen = aux_r['dependencie']['value']

                        order_list.append( [depen.split('#')[-1],op_name] )
                
                # Getting input and output descriptors

                dependencie_query = load_query_template('iodescriptor')
                
                for input in in_list:

                    in_el = input.split("#")[-1]
                    aux_query = dependencie_query.replace('?ioobject','<{}>'.format(input))

                    self.fetch_conn.setQuery(aux_query)
                    
                    aux_ret = self.fetch_conn.queryAndConvert()

                    for aux_ret_el in aux_ret["results"]["bindings"]:
                        meta = aux_ret_el['metadata']['value']

                        io_metadata[in_el] = meta.split("#")[-1]
                        aux_io_metadata[in_el] = meta

                for output in out_list:

                    out_el = output.split("#")[-1]
                    aux_query = dependencie_query.replace('?ioobject','<{}>'.format(output))

                    self.fetch_conn.setQuery(aux_query)
                    
                    aux_ret = self.fetch_conn.queryAndConvert()

                    for aux_ret_el in aux_ret["results"]["bindings"]:
                        meta = aux_ret_el['metadata']['value']

                        io_metadata[out_el] = meta.split("#")[-1]
                        aux_io_metadata[out_el] = meta


            # Getting descriptors info

            descriptors = {}

            descriptor_list = set(aux_io_metadata.values())

            attributes_query = load_query_template('des_attributes')
            attr_info_query = load_query_template("attr_info")

            for descriptor in descriptor_list:
                
                des_el = descriptor.split("#")[-1]

                # descriptors[des_el]={}

                query = attributes_query.replace('?descriptor',"<{}>".format(descriptor))

                self.conn.setQuery(query)

                ret = self.conn.queryAndConvert()

                aux_dic = {}
                for ret_el in ret['results']['bindings']:
                    attr = ret_el["attribute"]["value"]
                    aux_query = attr_info_query.replace('?attribute',"<{}>".format(attr))

                    self.conn.setQuery(aux_query)

                    aux_ret = self.conn.queryAndConvert()

                    attr_name = aux_ret["results"]["bindings"][0]["name"]["value"]
                    attr_value = aux_ret["results"]["bindings"][0]["possibleType"]["value"].split("#")[-1]

                    aux_dic[attr_name] = attr_value
                
                descriptors[des_el] = aux_dic


            experiment_dic['order_list'] = order_list
            experiment_dic['operators'] = op_dic
            experiment_dic["io_metadata"] = io_metadata
            experiment_dic["descriptors"] = descriptors
            

            return experiment_dic

        except Exception as e:
            print(e.with_traceback())
            return None



    def decode_value(self,value_iri: str):
        
        # 1. get value type ( can be list, direct and key-value)

        # Getting value type
        type_query = load_query_template('type')

        type_query = type_query.replace('?entity','<{}>'.format(value_iri))

        self.fetch_conn.setQuery(type_query)
        
        ret = self.fetch_conn.queryAndConvert()

        type = ret['results']['bindings'][0]['type']['value']

        type = type.split('#')[-1]

        match type:
            case 'DirectValue':
                
                direct_value_query = load_query_template('direct_value')
                direct_value_query = direct_value_query.replace('?DirectValue','<{}>'.format(value_iri))

                self.fetch_conn.setQuery(direct_value_query)

                aux_ret = self.fetch_conn.queryAndConvert()

                return aux_ret['results']['bindings'][0]['plainValue']['value']
                

            case 'List':

                list_element_query = load_query_template('list_element')
                list_element_query = list_element_query.replace('?list','<{}>'.format(value_iri))

                self.fetch_conn.setQuery(list_element_query)

                aux_ret = self.fetch_conn.queryAndConvert()

                el_list = []

                for aux_r in aux_ret['results']['bindings']:
                    list_element=aux_r['element']['value']

                    decoded_element = self.decode_value(list_element) 

                    el_list.append(decoded_element)                   
                    

                return el_list

            case 'KeyValueCollection':

                keyvalue_element_query = load_query_template('keyvalue_element')
                keyvalue_element_query = keyvalue_element_query.replace('?keyvaluecollection','<{}>'.format(value_iri))
                self.fetch_conn.setQuery(keyvalue_element_query)

                aux_ret = self.fetch_conn.queryAndConvert()

                key_value_collection = {}

                for aux_r in aux_ret['results']['bindings']:
                    key=aux_r['key']['value'].split('#')[-1]

                    value_decoded = self.decode_value(aux_r['value']['value']) 

                    key_value_collection[key] = value_decoded                   

                return key_value_collection



# exp = "http://www.semanticweb.org/DM/ontologies/DMProcess.owl#Iris_SVM_Experiment"
# exp = "http://www.semanticweb.org/DM/ontologies/MLOpsExp#New_Exp"

# data_fetcher = DataFetcher()

# exp_dic = data_fetcher.fetch_experiment(exp)

# print(exp_dic)


# with open('sample.json','w') as outJSON:
#     json.dump(exp_dic,outJSON,sort_keys=True,indent=4)