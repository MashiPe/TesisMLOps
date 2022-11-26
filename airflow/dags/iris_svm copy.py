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
)
def iris_svm_experiment():

    @task
    def read_table_iris_fun():

        data_set_name='iris'
        datasets_data_base= 'test'
        datasquema_data_base = 'squemas'
        output_dataset= 'IrisDataset'

        print( """ Fetching data with parameters:
                    data-set-name: {} 
                    dataset-data-base: {}
                    datasquema-data-base: {}
                    This output a dataset with name {}""".format(data_set_name,datasets_data_base,datasquema_data_base
                                                                , output_dataset) )


    @task
    def map_class_fun():

        in_dataset = 'IrisDataset'
        out_dataset = 'EncodedIrisDataset '
        target = 'class'
        encode_map = {}
        encode_map['Iris-virginica'] = 3 
        encode_map['Iris-versicolor'] = 2 
        encode_map['Iris-setosa'] = 1 

        print( """ Maping data with parameters:
                    in_dataset: {} 
                    out_dataset: {}
                    target: {}
                    map: {}""".format(in_dataset,out_dataset,target,encode_map) )


    read_table_iris_op = read_table_iris_fun()


    map_class_op = map_class_fun()


    read_table_iris_op>>map_class_op


dag = iris_svm_experiment()