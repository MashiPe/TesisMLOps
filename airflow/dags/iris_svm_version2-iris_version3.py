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
def iris_svm_version2iris_version3():

    @task
    def read_table_irisdatasetv1_fun():

        inifile = 'iris_svm_version2iris_version3.ini'
        data_set_name='irisdatasetv1'
        datasets_data_base= 'datasets'
        datasquema_data_base = 'squemas'
        output_dataset= 'iris_svm_dataset'
        sep= ','

        print( """ Fetching data with parameters:
                    data-set-name: {} 
                    dataset-data-base: {}
                    datasquema-data-base: {}
                    This output a dataset with name {}""".format(data_set_name,datasets_data_base,datasquema_data_base
                                                                , output_dataset) )

        #Here we should change to get the host from template arguments and better way to send arguments
        url = 'http://ejecutor:4001/ejecutarpython/frompersistency.py'
        body = {'parametros': {'table_input':data_set_name,'table_output':output_dataset,'ini_file':inifile} }

        x = requests.post(url, json = body)

        print(x.text)


    @task
    def correlation_iris_svm_dataset_fun():

        inifile = 'iris_svm_version2iris_version3.ini'
        in_dataset = 'iris_svm_dataset'
        table_output = 'coorrelacion'
        columns = []


        print( """ Generating correlaction graph with parameters:
                    in_dataset: {} 
                    out_graph: {}
                    columns: {}
                    """.format(in_dataset,table_output,columns) )

        #Here we should change to get the host from template arguments and better way to send arguments
        url = 'http://ejecutor:4001/ejecutarpython/get_correlation_graph.py'
        body ={'parametros': {'table_input':in_dataset,'table_output':table_output,'ini_file':inifile,'columns':columns} }

        x = requests.post(url, json = body)

        print(x.text)


    read_table_irisdatasetv1_op = read_table_irisdatasetv1_fun()


    correlation_iris_svm_dataset_op = correlation_iris_svm_dataset_fun()


    read_table_irisdatasetv1_op>>correlation_iris_svm_dataset_op


dag = iris_svm_version2iris_version3()