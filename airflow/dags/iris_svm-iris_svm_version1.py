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
def iris_svmiris_svm_version1():

    @task
    def correlation_iris_svm_encoded_fun():

        inifile = 'iris_svmiris_svm_version1.ini'
        in_dataset = 'iris_svm_encoded'
        table_output = 'coorrelacion'
        version = 'NA'
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
    def conf_matrix_iris_svm_training_fun():

        inifile = 'iris_svmiris_svm_version1.ini'
        model = 'iris_svm_model'
        test_dataset = 'iris_svm_training'
        res = 'confusion'
        version = 'NA'
        

        #Here we should change to get the host from template arguments and better way to send arguments
        url = 'http://ejecutor:4001/ejecutarpython/conf_matrix.py'
        body ={'parametros': {'test_dataset':test_dataset,'version': '{}_model'.format(model),'ini_file':inifile,
               'version':version } }

        x = requests.post(url, json = body)

        print(x.text)


    @task
    def read_table_iris_svm_dataset_version1_fun():

        inifile = 'iris_svmiris_svm_version1.ini'
        data_set_name='iris_svm_dataset_version1'
        datasets_data_base= 'datasets'
        datasquema_data_base = 'squemas'
        output_dataset= 'iris_svm_dataset'
        sep= ','
        version = 'NA'

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
    def split_iris_svm_encoded_fun():

        inifile = 'iris_svmiris_svm_version1.ini'
        in_dataset = 'iris_svm_encoded'
        train_dataset = 'iris_svm_training'
        test_dataset = 'iris_svm_test'
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
    def map_iris_svm_dataset_iris_svm_encoded_fun():

        inifile = 'iris_svmiris_svm_version1.ini'
        in_dataset = 'iris_svm_dataset'
        out_dataset = 'iris_svm_encoded'
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
    def svm_iris_svm_training_fun():

        inifile = 'iris_svmiris_svm_version1.ini'
        train_dataset = 'iris_svm_training'
        test_dataset = 'NA'
        out_model = 'iris_svm_model'
        
        kernel = 'linear'

        #Here we should change to get the host from template arguments and better way to send arguments
        url = 'http://ejecutor:4001/ejecutarpython/SVM.py'
        body ={'parametros': {'train_dataset':train_dataset,'test_dataset': test_dataset,'ini_file':inifile, 
                'version':'{}_model'.format(out_model),'kernel':kernel} }

        x = requests.post(url, json = body)

        print(x.text)


    correlation_iris_svm_encoded_op = correlation_iris_svm_encoded_fun()


    conf_matrix_iris_svm_training_op = conf_matrix_iris_svm_training_fun()


    read_table_iris_svm_dataset_version1_op = read_table_iris_svm_dataset_version1_fun()


    split_iris_svm_encoded_op = split_iris_svm_encoded_fun()


    map_iris_svm_dataset_iris_svm_encoded_op = map_iris_svm_dataset_iris_svm_encoded_fun()


    svm_iris_svm_training_op = svm_iris_svm_training_fun()


    read_table_iris_svm_dataset_version1_op>>map_iris_svm_dataset_iris_svm_encoded_op


    map_iris_svm_dataset_iris_svm_encoded_op>>correlation_iris_svm_encoded_op


    map_iris_svm_dataset_iris_svm_encoded_op>>split_iris_svm_encoded_op


    split_iris_svm_encoded_op>>svm_iris_svm_training_op


    split_iris_svm_encoded_op>>conf_matrix_iris_svm_training_op


    svm_iris_svm_training_op>>conf_matrix_iris_svm_training_op


dag = iris_svmiris_svm_version1()