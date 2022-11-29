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
    'op_type' : 'querys/fetch_operator_type.rq',
    'op_IO' : 'querys/fetch_operator_IO.rq',
}

def load_query_template(template: str = ''):

    query = ''
    template_path = query_template_paths[template]

    with open(template_path,'r') as query_template:
        query = query_template.read()

    return query

#TODO:
# - Finish datafetcher to recover information and organize information as JSON
class DataFetcher():

    def __init__(self,host:str = GRAPHDB_HOST , repo: str = DEFAUL_REPO) -> None:
        
        self.endpoint = "{}/repositories/{}".format(host,repo)

        conn = SPARQLWrapper(
            self.endpoint
        )
        conn.setReturnFormat(JSON)

        self.conn = conn
    

    def fetch_experiment(self,experiment:str = ''):
        
        info_query = load_query_template('exp_info')

        info_query = info_query.replace('?experiment','<{}>'.format(experiment))

        # print(info_query)

        self.conn.setQuery(info_query)

        try:
            ret = self.conn.queryAndConvert()

            for r in ret["results"]["bindings"]:
                print(r)

        except Exception as e:
            print(e)


        ops_query = load_query_template('exp_ops')

        ops_query = ops_query.replace('?experiment','<{}>'.format(experiment))

        # print(ops_query)

        self.conn.setQuery(ops_query)

        try:
            ret = self.conn.queryAndConvert()

            for r in ret["results"]["bindings"]:
                print(r)

        except Exception as e:
            print(e)


exp = "http://www.semanticweb.org/DM/ontologies/DMProcess.owl#Iris_SVM_Experiment"

data_fetcher = DataFetcher()

data_fetcher.fetch_experiment(exp)