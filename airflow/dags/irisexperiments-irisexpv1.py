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
def irisexperimentsirisexpv1():

    @task
    def svm_encoded_fun():

        inifile = 'irisexperimentsirisexpv1.ini'
        train_dataset = 'encoded'
        test_dataset = 'NA'
        out_model = 'modelsvm1'
        
        kernel = 'linear'

        #Here we should change to get the host from template arguments and better way to send arguments
        url = 'http://ejecutor:4001/ejecutarpython/SVM.py'
        body ={'parametros': {'train_dataset':train_dataset,'test_dataset': test_dataset,'ini_file':inifile, 
                'version':'{}_model'.format(out_model),'kernel':kernel} }

        x = requests.post(url, json = body)

        print(x.text)


    @task
    def read_table_irisdatasetv1_fun():

        inifile = 'irisexperimentsirisexpv1.ini'
        data_set_name='irisdatasetv1'
        datasets_data_base= 'datasets'
        datasquema_data_base = 'squemas'
        output_dataset= 'irisdata'
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
    def map__fun():

        inifile = 'irisexperimentsirisexpv1.ini'
        in_dataset = 'irisdata'
        out_dataset = 'encoded'
        columns = []

        print( """ Maping data with parameters:
                    in_dataset: {} 
                    out_dataset: {}
                    map: {}""".format(in_dataset,out_dataset,columns) )

        #Here we should change to get the host from template arguments and better way to send arguments
        url = 'http://ejecutor:4001/ejecutarpython/encode_categorical.py'
        body ={'parametros': {'table_input':in_dataset,'table_output':out_dataset,'ini_file':inifile,'columns': columns } }

        x = requests.post(url, json = body)


        print(x.text)


    svm_encoded_op = svm_encoded_fun()


    read_table_irisdatasetv1_op = read_table_irisdatasetv1_fun()


    map__op = map__fun()


    read_table_irisdatasetv1_op>>map__op


    map__op>>svm_encoded_op


dag = irisexperimentsirisexpv1()