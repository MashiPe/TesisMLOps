from SPARQLWrapper import SPARQLWrapper, JSON

GRAPHDB_HOST = 'http://localhost:7200'
DEFAUL_REPO = 'mashitesis'

sparql = SPARQLWrapper(
    "http://localhost:7200/repositories/mashitesis"
)
sparql.setReturnFormat(JSON)

# gets the first 3 geological ages
# from a Geological Timescale database,
# via a SPARQL endpoint
sparql.setQuery("""
    PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
    PREFIX DMProcess:<http://www.semanticweb.org/DM/ontologies/DMProcess.owl#>

    select ?operators where {
        DMProcess:Iris_SVM_Experiment DMProcess:has_resource ?operators .
    }
    """
)

try:
    ret = sparql.queryAndConvert()

    for r in ret["results"]["bindings"]:
        print(r)
except Exception as e:
    print(e)


query_template_paths = {
    'exp_info' : 'querys/fetch_experiment_inf.rq',
    'exp_ops' : 'querys/fetch_experiment_ops.rq',
    'type' : 'querys/fetch_type.rq',
    'op_in' : 'querys/fetch_operator_input.rq',
    'op_out' : 'querys/fetch_operator_output.rq',
    'op_param' : 'querys/fetch_operator_param.rq',
    'param_name_value' : 'querys/fetch_param_name_value.rq',
    'direct_value' : 'querys/fetch_direct_value.rq',
}

def load_query_template(template: str = ''):

    query = ''
    template_path = query_template_paths[template]

    with open(template_path,'r') as query_template:
        query = query_template.read()

    return query

#TODO:Finish datafetcher to recover information and organize information as JSON
class DataFetcher():

    def __init__(self,host:str = GRAPHDB_HOST , repo: str = DEFAUL_REPO) -> None:
        
        self.endpoint = "{}/repositories/{}".format(host,repo)

        conn = SPARQLWrapper(
            self.endpoint
        )
        conn.setReturnFormat(JSON)

        self.conn = conn
    

    def fetch_experiment(self,experiment:str = ''):

        experiment_dic = {}
        experiment_dic['order_list'] = []
        experiment_dic['operators'] = {}

        info_query = load_query_template('exp_info')

        info_query = info_query.replace('?experiment','<{}>'.format(experiment))

        # print(info_query)

        self.conn.setQuery(info_query)

        try:
            ret = self.conn.queryAndConvert()

            for r in ret["results"]["bindings"]:
                experiment_dic['experiment_name'] = r['name']
                print(r)

        except Exception as e:
            print(e)


        ops_query = load_query_template('exp_ops')

        ops_query = ops_query.replace('?experiment','<{}>'.format(experiment))

        self.conn.setQuery(ops_query)

        try:
            ret = self.conn.queryAndConvert()

            for r in ret["results"]["bindings"]:
                
                op_IRI = r['operator']
                
                op_dic = {}


                # Getting all inputs for operator
                in_query = load_query_template('op_in')

                in_query = in_query.replace('?operator','<{}>'.format(op_IRI))

                self.conn.setQuery(in_query)
                
                aux_ret = self.conn.queryAndConvert()

                in_list = []                

                for aux_r in aux_ret['results']['bindings']:
                    in_list.append(aux_r['input'])


                # Getting all outputs for operator
                out_query = load_query_template('op_out')

                out_query = out_query.replace('?operator','<{}>'.format(op_IRI))

                self.conn.setQuery(out_query)
                
                aux_ret = self.conn.queryAndConvert()

                out_list = []                

                for aux_r in aux_ret['results']['bindings']:
                    out_list.append(aux_r['output'])

                
                # Getting operator type
                type_query = load_query_template('type')

                type_query = type_query.replace('?entity','<{}>'.format(op_IRI))

                self.conn.setQuery(type_query)
                
                aux_ret = self.conn.queryAndConvert()

                op_type = ''                

                for aux_r in aux_ret['results']['bindings']:
                    op_type=aux_r['type']

                
                # Getting operator parameters
                param_query = load_query_template('op_param')

                param_query = param_query.replace('?operator','<{}>'.format(op_IRI))

                self.conn.setQuery(param_query)
                
                aux_ret = self.conn.queryAndConvert()

                op_dic = {}                

                for aux_r in aux_ret['results']['bindings']:

                    param_IRI = aux_r['parameter']

                    param_name_value_query = load_query_template('param_name_value')

                    param_name_value_query= param_name_value_query.replace('?parameter','<{}>'.format(param_IRI))

                    self.conn.setQuery(param_name_value_query)
                    
                    ret_param = self.conn.queryAndConvert()

                    param_name = ret_param['results']['bindings'][0]['name']
                    param_value_IRI = ret_param['results']['bindings'][0]['value']


                    formated_value = self.decode_value(param_value_IRI)

                    # 4. format operator information into dic

                    pass

                #TODO: write process to get operator dependencies

        except Exception as e:
            print(e)


    #TODO: write query templates to recover value information
    def decode_value(self,value_iri: str):
        
        # 1. get value type ( can be list, direct and key-value)

        # Getting value type
        type_query = load_query_template('type')

        type_query = type_query.replace('?entity','<{}>'.format(value_iri))

        self.conn.setQuery(type_query)
        
        ret = self.conn.queryAndConvert()

        type = ret['results']['bindings'][0]['type']

        type = type.split('#')[-1]

        match type:
            case 'DirectValue':
                
                direct_value_query = load_query_template('direct_value')
                direct_value_query = direct_value_query.replace('?DirectValue','<{}>'.format(value_iri))

                self.conn.setQuery(direct_value_query)

                aux_ret = self.conn.queryAndConvert()

                return aux_ret['results']['bindings'][0]['plainValue']
                

            case 'List':
                pass

            case 'KeyValueCollection':
                pass

        # 2. decode value 
            # 2.1 If value type is direct, get simple_value and return -> done
            # 2.2 If value type is list, get  list elements
                # 2.2.1 If element direct value, get simple_value and return
                # 2.2.2 If element is another list or a dic, decode recursively
            # 2.3 If value type is dic, get all key-value elements
                # 2.2.1 If element.value is direct value, get simple_value and return
                # 2.2.2 If element.value another list or a dic, decode recursively

        pass



exp = "http://www.semanticweb.org/DM/ontologies/DMProcess.owl#Iris_SVM_Experiment"

data_fetcher = DataFetcher()

data_fetcher.fetch_experiment(exp)