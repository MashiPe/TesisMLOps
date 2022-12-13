from flask import Flask
from flask import request
import subprocess
import os
import fetch.data_fetcher as fetcher
import template.dag_generator as generator
from aprovisionamiento.aprovisionamiento import Aprovisionamiento
app = Flask(__name__)


@app.route('/')
def hello_world():
    return 'Hello World'

@app.route('/ejecutarpipeline')
def ejecutapipeline():
    pass
@app.route('/crearpipeline')
def crearpipeline():
    pass
@app.route('/getexperimento')
def consultar():
    exp_Iri=request.get_json()["exp_iri"]
    f=fetcher.DataFetcher()
    exp_dic = f.fetch_experiment(exp_Iri)

    return exp_dic
@app.route('/genpipeline',methods=['POST'])
def genpipe():
    exp_json=request.get_json()
    g=generator.Pipe_Generator(env='./template/templates');
    pipe= g.genPipe(exp_json)

    exp_name = exp_json['experiment_name']    
    
    with open("../airflow/dags/{}.py".format(exp_name),"w") as pipeline_file:
        pipeline_file.write(pipe)

    return pipe


@app.route('/insertargraph',methods=['POST'])
def insertargraphdb():
    #print(experimento)
    print(request.get_json())
    return "holi"
@app.route('/modificargraph')
def modificargraph():
    print(request.get_json())
    return "holi"
@app.route('/desplegar',methods=['POST'])
def desplegarservicios():
    servicios=request.get_json()
    lista=servicios["servicios"]
    aprovisionamiento=Aprovisionamiento(lista)
    aprovisionamiento.start()
    return "0"



if __name__ == '__main__':
    app.run('0.0.0.0', 4000)
