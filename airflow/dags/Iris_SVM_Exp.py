import datetime
import pendulum
import os

import requests
from airflow.decorators import dag, task


@dag(
    schedule_interval=None,
    start_date=pendulum.datetime(2021, 1, 1, tz="UTC"),
    catchup=False,
    dagrun_timeout=datetime.timedelta(minutes=60),
    tags=['MLOps']
)
def Iris_SVM_Exp():

    @task
    def map_class_fun():

        in_dataset = 'IrisDataset'
        out_dataset = 'EncodedIrisDataset'
        target = 'class'
        encode_map = {}
        encode_map['Iris-setosa'] = 1 
        encode_map['Iris-versicolor'] = 2 
        encode_map['Iris-virginica'] = 3 

        print( """ Maping data with parameters:
                    in_dataset: {} 
                    out_dataset: {}
                    target: {}
                    map: {}""".format(in_dataset,out_dataset,target,encode_map) )

        #Here we should change to get the host from template arguments and better way to send arguments
        url = 'http://ejecutor:4001/ejecutarpython/encode_categorical.py'
        body = {'parametros': ['{}.csv'.format(in_dataset),target,'{}.csv'.format(out_dataset)] }

        x = requests.post(url, json = body)

        print(x.text)


    @task
    def read_table_iris_fun():

        data_set_name='iris'
        datasets_data_base= 'datasets'
        datasquema_data_base = 'squemas'
        output_dataset= 'IrisDataset'

        print( """ Fetching data with parameters:
                    data-set-name: {} 
                    dataset-data-base: {}
                    datasquema-data-base: {}
                    This output a dataset with name {}""".format(data_set_name,datasets_data_base,datasquema_data_base
                                                                , output_dataset) )

        #Here we should change to get the host from template arguments and better way to send arguments
        url = 'http://ejecutor:4001/ejecutarpython/read_dataset.py'
        body = {'parametros': ['{}.csv'.format(data_set_name),'{}.csv'.format(output_dataset)] }

        x = requests.post(url, json = body)

        print(x.text)


    map_class_op = map_class_fun()


    read_table_iris_op = read_table_iris_fun()


    read_table_iris_op>>map_class_op


dag = Iris_SVM_Exp()