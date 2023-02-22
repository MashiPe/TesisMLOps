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
def iris_testiris_test_version1():

    @task
    def correlation_iris_test_encoded_fun():

        inifile = 'iris_testiris_test_version1.ini'
        in_dataset = 'iris_test_encoded'
        table_output = 'coorrelacion'
        version = 'iris_test_version1'
        columns = []


        print( """ Generating correlaction graph with parameters:
                    in_dataset: {} 
                    out_graph: {}
                    columns: {}
                    """.format(in_dataset,table_output,columns) )

        #Here we should change to get the host from template arguments and better way to send arguments
        url = 'http://ejecutor:4001/ejecutarpython/get_correlation_graph.py'
        body ={'parametros': {'table_input':in_dataset,'table_output':table_output,'ini_file':inifile,'columns':columns,
               'version':version } }

        x = requests.post(url, json = body)

        print(x.text)


    @task
    def map_iris_test_iris_test_encoded_fun():

        inifile = 'iris_testiris_test_version1.ini'
        in_dataset = 'iris_test'
        out_dataset = 'iris_test_encoded'
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


    @task
    def svm_iris_test_train_fun():

        inifile = 'iris_testiris_test_version1.ini'
        train_dataset = 'iris_test_train'
        test_dataset = 'NA'
        out_model = 'iris_test_model'
        
        kernel = 'linear'

        #Here we should change to get the host from template arguments and better way to send arguments
        url = 'http://ejecutor:4001/ejecutarpython/SVM.py'
        body ={'parametros': {'train_dataset':train_dataset,'test_dataset': test_dataset,'ini_file':inifile, 
                'version':'{}_model'.format(out_model),'kernel':kernel} }

        x = requests.post(url, json = body)

        print(x.text)


    @task
    def split_iris_test_encoded_fun():

        inifile = 'iris_testiris_test_version1.ini'
        in_dataset = 'iris_test_encoded'
        train_dataset = 'iris_test_train'
        test_dataset = 'iris_test_test'
        split_rate = 0.25
        
        print( """ Spliting data with parameters:
                    in_dataset: {} 
                    train_dataset: {}
                    test_dataset: {}
                    split_rate: {}""".format(in_dataset,train_dataset,test_dataset,split_rate) )

        #Here we should change to get the host from template arguments and better way to send arguments
        url = 'http://ejecutor:4001/ejecutarpython/split.py'
        body ={'parametros': {'table_input':in_dataset,'table_train':train_dataset,'table_test':test_dataset,'ini_file':inifile,'size':split_rate } }

        x = requests.post(url, json = body)

        print(x.text)


    @task
    def read_table_irisv1_fun():

        inifile = 'iris_testiris_test_version1.ini'
        data_set_name='irisv1'
        datasets_data_base= 'datasets'
        datasquema_data_base = 'squemas'
        output_dataset= 'iris_test'
        sep= ','
        version = 'iris_test_version1'

        print( """ Fetching data with parameters:
                    data-set-name: {} 
                    dataset-data-base: {}
                    datasquema-data-base: {}
                    This output a dataset with name {}""".format(data_set_name,datasets_data_base,datasquema_data_base
                                                                , output_dataset) )

        #Here we should change to get the host from template arguments and better way to send arguments
        url = 'http://ejecutor:4001/ejecutarpython/frompersistency.py'
        body = {'parametros': {'table_input':data_set_name,'table_output':output_dataset,'ini_file':inifile,
               'version':version } }

        x = requests.post(url, json = body)

        print(x.text)


    @task
    def conf_matrix_iris_test_test_fun():

        inifile = 'iris_testiris_test_version1.ini'
        model = 'iris_test_model'
        test_dataset = 'iris_test_test'
        res = 'confusion'
        version = 'iris_test_version1'
        

        #Here we should change to get the host from template arguments and better way to send arguments
        url = 'http://ejecutor:4001/ejecutarpython/conf_matrix.py'
        body ={'parametros': {'test_dataset':test_dataset,'version': '{}_model'.format(model),'ini_file':inifile,
               'version':version } }

        x = requests.post(url, json = body)

        print(x.text)


    correlation_iris_test_encoded_op = correlation_iris_test_encoded_fun()


    map_iris_test_iris_test_encoded_op = map_iris_test_iris_test_encoded_fun()


    svm_iris_test_train_op = svm_iris_test_train_fun()


    split_iris_test_encoded_op = split_iris_test_encoded_fun()


    read_table_irisv1_op = read_table_irisv1_fun()


    conf_matrix_iris_test_test_op = conf_matrix_iris_test_test_fun()


    read_table_irisv1_op>>map_iris_test_iris_test_encoded_op


    map_iris_test_iris_test_encoded_op>>correlation_iris_test_encoded_op


    map_iris_test_iris_test_encoded_op>>split_iris_test_encoded_op


    split_iris_test_encoded_op>>svm_iris_test_train_op


    split_iris_test_encoded_op>>conf_matrix_iris_test_test_op


    svm_iris_test_train_op>>conf_matrix_iris_test_test_op


dag = iris_testiris_test_version1()