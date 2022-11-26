from SPARQLWrapper import SPARQLWrapper, JSON

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
        print(r['operators']['value'])
except Exception as e:
    print(e)