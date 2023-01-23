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
def irisv1():

    @task
    def correlation_EncodedIrisDataset_fun():

        inifile = 'irisv1.ini'
        in_dataset = 'EncodedIrisDataset'
        table_output = 'CorrelationGraph'
        columns = []

        columns.append('sepal_length')
        columns.append('sepal_width')
        columns.append('petal_length')
        columns.append('petal_width')
        columns.append('class')

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


    @task
    def map__fun():

        inifile = 'irisv1.ini'
        in_dataset = 'IrisDataset'
        out_dataset = 'EncodedIrisDataset'
        columns = []
        aux_encode_map = {}
        aux_encode_map['class'] = {'Iris-setosa': '1', 'Iris-versicolor': '2', 'Iris-virginica': '3'}
        columns.append(aux_encode_map) 

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
    def conf_matrix_IrisTest_fun():

        inifile = 'irisv1.ini'
        model = 'SVM_Model'
        test_dataset = 'IrisTest'
        res = 'eval_result'
        

        #Here we should change to get the host from template arguments and better way to send arguments
        url = 'http://ejecutor:4001/ejecutarpython/conf_matrix.py'
        body ={'parametros': {'test_dataset':test_dataset,'version': '{}_model'.format(model),'ini_file':inifile} }

        x = requests.post(url, json = body)

        print(x.text)


    @task
    def svm_IrisTrain_fun():

        inifile = 'irisv1.ini'
        train_dataset = 'IrisTrain'
        test_dataset = 'IrisTest'
        out_model = 'SVM_Model'
        
        kernel = 'linear'

        #Here we should change to get the host from template arguments and better way to send arguments
        url = 'http://ejecutor:4001/ejecutarpython/SVM.py'
        body ={'parametros': {'train_dataset':train_dataset,'test_dataset': test_dataset,'ini_file':inifile, 
                'version':'{}_model'.format(out_model),'kernel':kernel} }

        x = requests.post(url, json = body)

        print(x.text)


    @task
    def read_table_iris_fun():

        inifile = 'irisv1.ini'
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
        url = 'http://ejecutor:4001/ejecutarpython/csv_to_postgres.py'
        body = {'parametros': {'csv':'{}.csv'.format(data_set_name),'table_output':output_dataset,'ini_file':inifile} }

        x = requests.post(url, json = body)

        print(x.text)


    @task
    def split_EncodedIrisDataset_fun():

        inifile = 'irisv1.ini'
        in_dataset = 'EncodedIrisDataset'
        train_dataset = 'IrisTrain'
        test_dataset = 'IrisTest'
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


    correlation_EncodedIrisDataset_op = correlation_EncodedIrisDataset_fun()


    map__op = map__fun()


    conf_matrix_IrisTest_op = conf_matrix_IrisTest_fun()


    svm_IrisTrain_op = svm_IrisTrain_fun()


    read_table_iris_op = read_table_iris_fun()


    split_EncodedIrisDataset_op = split_EncodedIrisDataset_fun()


    read_table_iris_op>>map__op


    map__op>>correlation_EncodedIrisDataset_op


    map__op>>split_EncodedIrisDataset_op


    split_EncodedIrisDataset_op>>svm_IrisTrain_op


    split_EncodedIrisDataset_op>>conf_matrix_IrisTest_op


    svm_IrisTrain_op>>conf_matrix_IrisTest_op


dag = irisv1()