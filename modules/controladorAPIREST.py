from flask import Flask
from flask import request
import subprocess
import os
import fetch.data_fetcher as fetcher
import template.dag_generator as generator
from aprovisionamiento.aprovisionamiento import Aprovisionamiento
from sqlalchemy import create_engine
from config import config
import pandas as pd
import numpy as np
from flask_cors import CORS
from flask import jsonify

app = Flask(__name__)
CORS(app)

inifile="persistencia.ini"

@app.route('/')
def hello_world():
    return 'Hello World'

@app.route('/ejecutarpipeline')
def ejecutapipeline():
    pass
@app.route('/crearpipeline')
def crearpipeline():
    pass

@app.route('/exp/<exp_iri>')
def consultar(exp_iri):
    # exp_Iri=request.get_json()["exp_iri"]
    f=fetcher.DataFetcher()
    exp_dic = f.fetch_experiment(exp_iri)

    return exp_dic

@app.route('/datasetlist')
def list_datasets():
    f = fetcher.DataFetcher()
    res = f.fetch_dataset_list()
    return jsonify(res)

@app.route('/explist')
def list_exp():
    f = fetcher.DataFetcher()

    return jsonify(f.fetch_experiment_list())

@app.route('/newexp',methods=['post'])
def new_exp():
    exp_dir=request.get_json()["new_exp"]
    f = fetcher.datafetcher()

    new_info=f.post_new_exp(exp_dir)    

    return new_info

@app.route('/newdataset',methods=['POST'])
def new_dataset():
    dataset_dir=request.get_json()["new_dataset"]
    f = fetcher.DataFetcher()
    new_info=f.post_new_dataset(dataset_dir)    

    return new_info

@app.route('/newdatasetversion',methods=['post'])
def new_dataset_version():
    version_file=request.files['file']
    data = dict(request.form)
    dataverion_name = data['version_name']
    dataset_ref = data['dataset_link']

    df = pd.read_csv(version_file)

    csv_info_columns= list(df.dtypes.index)
    csv_info_types= list(df.dtypes)

    columns =[]

    for i,_ in enumerate(csv_info_columns):
        columns.append({
            "name": csv_info_columns[i],
            "type": csv_info_types[i]
        })


    params = config(config_db=inifile)
    conn_string = "postgresql://postgres:pass@" + params["host"] + "/" + params["dbname"] + "?user=" + params["user"] + "&password=" + params["password"]
    engine = create_engine(conn_string)

    df.to_sql(dataverion_name.replace(" ","").lower(),con=engine)

    version_dic={
        'dataset': dataset_ref,
        'dataversion_name': dataverion_name,
        'columns': columns,
        "data_table": dataverion_name.replace(" ","").lower()
    }

    f = fetcher.DataFetcher()

    new_info=f.post_new_version(version_dic)    
    
    new_info['preview']['records']=df[:30].to_json(orient="records")

    return new_info


@app.route('/genpipeline',methods=['POST'])
def genpipe():
    exp_json=request.get_json()
    g=generator.Pipe_Generator(env='./template/templates');
    pipe= g.genPipe(exp_json)

    exp_name = exp_json['experiment_name']
    version_name = exp_json['version_name']    
    
    with open("../airflow/dags/{}-{}.py".format(exp_name,version_name),"w") as pipeline_file:
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

@app.route('/gettable/<table>',methods=['GET'])
def gettable(table):
    # json=request.get_json()
    # table=json["table"]
    params = config(config_db=inifile)
    conn_string = "postgresql://postgres:pass@" + params["host"] + "/" + params["dbname"] + "?user=" + params["user"] + "&password=" + params["password"]
    engine = create_engine(conn_string)
    dataset = pd.read_sql_query("select * from " + table.lower()+ " limit 30", con=engine)  # leer de base de datos
    dataset.drop('index', inplace=True, axis=1)
    return dataset.to_json(orient="records")


@app.route('/getcolumns',methods=['GET'])
def getcolumns():
    json=request.get_json()
    table=json["table"]
    params = config(config_db=inifile)
    conn_string = "postgresql://postgres:pass@" + params["host"] + "/" + params["dbname"] + "?user=" + params["user"] + "&password=" + params["password"]
    engine = create_engine(conn_string)
    dataset = pd.read_sql_query("select * from " + table.lower(), con=engine)
    dataset.drop('index', inplace=True, axis=1)
    columnas=dataset.columns.to_list()
    resp={}
    for i in columnas:
        resp[i]=dataset[i].unique().tolist()
    return resp

if __name__ == '__main__':
    app.run('0.0.0.0', 4000)
