from SPARQLWrapper import SPARQLWrapper, JSON
import json
import os

GRAPHDB_HOST = 'http://localhost:7200'
DEFAUL_REPO = 'mashitesis'

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
    'attr_info':'fetch/querys/fetch/fetch_attribute_info.rq'
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
        self.endpoint = "{}/repositories/{}".format(host,repo)

        conn = SPARQLWrapper(
            self.endpoint
        )
        conn.setReturnFormat(JSON)
        conn.addParameter("infer","false")

        self.conn = conn
    

    def fetch_experiment(self,experiment:str = ''):

        experiment_dic = {}

        info_query = load_query_template('version_info')

        info_query = info_query.replace('?version','<{}>'.format(experiment))

        # print(info_query)

        self.conn.setQuery(info_query)

        try:
            ret = self.conn.queryAndConvert()

            for r in ret["results"]["bindings"]:
                experiment_dic['experiment_name'] = r['name']['value']
                print(r)

        except Exception as e:
            print(e)


        ops_query = load_query_template('version_ops')

        ops_query = ops_query.replace('?version','<{}>'.format(experiment))

        self.conn.setQuery(ops_query)
            
        op_dic = {}

        order_list = []

        io_metadata = {}
        aux_io_metadata={}

        try:
            ret = self.conn.queryAndConvert()

            for r in ret["results"]["bindings"]:
                
                op_IRI = r['operator']['value']               

                # decoded_op = {}

                # Getting all inputs for operator
                in_query = load_query_template('op_in')

                in_query = in_query.replace('?operator','<{}>'.format(op_IRI))

                self.conn.setQuery(in_query)
                
                aux_ret = self.conn.queryAndConvert()

                in_list = []                

                for aux_r in aux_ret['results']['bindings']:
                    in_list.append(aux_r['input']['value'])


                # Getting all outputs for operator
                out_query = load_query_template('op_out')

                out_query = out_query.replace('?operator','<{}>'.format(op_IRI))

                self.conn.setQuery(out_query)
                
                aux_ret = self.conn.queryAndConvert()

                out_list = []                

                for aux_r in aux_ret['results']['bindings']:
                    out_list.append(aux_r['output']['value'])

                
                # Getting operator type
                type_query = load_query_template('type')

                type_query = type_query.replace('?entity','<{}>'.format(op_IRI))

                self.conn.setQuery(type_query)
                
                aux_ret = self.conn.queryAndConvert()

                op_type = aux_ret['results']['bindings'][0]['type']['value'].split('#')[-1]


                # Getting operator env
                env_query = load_query_template('env')

                env_query = env_query.replace('?operator','<{}>'.format(op_IRI))

                self.conn.setQuery(env_query)
                
                aux_ret = self.conn.queryAndConvert()

                op_env = aux_ret['results']['bindings'][0]['env']['value'].split('#')[-1]
                

                # Getting operator parameters
                param_query = load_query_template('op_param')

                param_query = param_query.replace('?operator','<{}>'.format(op_IRI))

                self.conn.setQuery(param_query)
                
                aux_ret = self.conn.queryAndConvert()

                param_dic = {}                

                for aux_r in aux_ret['results']['bindings']:

                    param_IRI = aux_r['parameter']['value']

                    param_name_value_query = load_query_template('param_name_value')

                    param_name_value_query= param_name_value_query.replace('?parameter','<{}>'.format(param_IRI))

                    self.conn.setQuery(param_name_value_query)
                    
                    ret_param = self.conn.queryAndConvert()

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

                    self.conn.setQuery(aux_query)
                    
                    aux_ret = self.conn.queryAndConvert()

                    for aux_r in aux_ret['results']['bindings']:
                        depen = aux_r['dependencie']['value']

                        order_list.append( [depen.split('#')[-1],op_name] )
                
                # Getting input and output descriptors

                dependencie_query = load_query_template('iodescriptor')
                
                for input in in_list:

                    in_el = input.split("#")[-1]
                    aux_query = dependencie_query.replace('?ioobject','<{}>'.format(input))

                    self.conn.setQuery(aux_query)
                    
                    aux_ret = self.conn.queryAndConvert()

                    for aux_ret_el in aux_ret["results"]["bindings"]:
                        meta = aux_ret_el['metadata']['value']

                        io_metadata[in_el] = meta.split("#")[-1]
                        aux_io_metadata[in_el] = meta

                for output in out_list:

                    out_el = output.split("#")[-1]
                    aux_query = dependencie_query.replace('?ioobject','<{}>'.format(output))

                    self.conn.setQuery(aux_query)
                    
                    aux_ret = self.conn.queryAndConvert()

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

        self.conn.setQuery(type_query)
        
        ret = self.conn.queryAndConvert()

        type = ret['results']['bindings'][0]['type']['value']

        type = type.split('#')[-1]

        match type:
            case 'DirectValue':
                
                direct_value_query = load_query_template('direct_value')
                direct_value_query = direct_value_query.replace('?DirectValue','<{}>'.format(value_iri))

                self.conn.setQuery(direct_value_query)

                aux_ret = self.conn.queryAndConvert()

                return aux_ret['results']['bindings'][0]['plainValue']['value']
                

            case 'List':

                list_element_query = load_query_template('list_element')
                list_element_query = list_element_query.replace('?list','<{}>'.format(value_iri))

                self.conn.setQuery(list_element_query)

                aux_ret = self.conn.queryAndConvert()

                el_list = []

                for aux_r in aux_ret['results']['bindings']:
                    list_element=aux_r['element']['value']

                    decoded_element = self.decode_value(list_element) 

                    el_list.append(decoded_element)                   
                    

                return el_list

            case 'KeyValueCollection':

                keyvalue_element_query = load_query_template('keyvalue_element')
                keyvalue_element_query = keyvalue_element_query.replace('?keyvaluecollection','<{}>'.format(value_iri))

                self.conn.setQuery(keyvalue_element_query)

                aux_ret = self.conn.queryAndConvert()

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