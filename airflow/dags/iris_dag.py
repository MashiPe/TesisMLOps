import datetime
import pendulum
import os
# from modules.utils.database.postgres_connector import PostgresConnector

import requests
from airflow.decorators import dag, task
from airflow.providers.postgres.hooks.postgres import PostgresHook
from airflow.providers.postgres.operators.postgres import PostgresOperator


@dag(
    schedule_interval=None,
    start_date=pendulum.datetime(2021, 1, 1, tz="UTC"),
    catchup=False,
    dagrun_timeout=datetime.timedelta(minutes=60),
)
def Iris():

    # create_iris_table_table = PostgresOperator(
    #     task_id="create_iris_table",
    #     postgres_conn_id="tutorial_pg_conn",
    #     sql="""
    #         CREATE TABLE IF NOT EXISTS iris (
    #             "sepal_length_in_cm" NUMERIC,
    #             "sepal_width_in_cm" NUMERIC,
    #             "petal_length_in_cm" NUMERIC,
    #             "petal_width_in_cm" NUMERIC,
    #             "class" TEXT
    #         );""",
    # )

    # create_iris_encoded_table_table = PostgresOperator(
    #     task_id="create_iris_encode_table",
    #     postgres_conn_id="tutorial_pg_conn",
    #     sql="""
    #         CREATE TABLE IF NOT EXISTS iris (
    #             "sepal_length_in_cm" NUMERIC,
    #             "sepal_width_in_cm" NUMERIC,
    #             "petal_length_in_cm" NUMERIC,
    #             "petal_width_in_cm" NUMERIC,
    #             "class" TEXT
    #         );""",
    # )

    @task
    def get_data():
        data_path = "/opt/airflow/dags/files/iris.csv"

        print("""
                Here we should send a request to the docker container that has the python enviroment to read the data from the \\n
                repo and put it on cache
                """)
        # postgres_hook = PostgresHook(postgres_conn_id="tutorial_pg_conn")
        # conn = postgres_hook.get_conn()
        # cur = conn.cursor()
        # with open(data_path, "r") as file:
        #     cur.copy_expert(
        #         "COPY iris FROM STDIN WITH CSV HEADER DELIMITER AS ',' QUOTE '\"'",
        #         file,
        #     )
        # conn.commit()
    
    @task
    def encode_data():
        database = 'airflow'
        data_table = "iris"
        hostname = 'postgres'
        user='airflow'
        password='airflow'

        attribute = 'class'
        new_encode = {"Iris-setosa":1,"Iris-versicolor":2, "Iris-virginica":3} 


        print("""
                Here we should send a request to the docker container that has the python enviroment to read the dataset from cached \\n
                results on postgres and make de operation.
                """)

        # pg_conn = PostgresConnector(hostname=hostname,database=database,user=user,password=password)

        # df = pg_conn.readTable(data_table)

        # df = df.replace({attribute,new_encode})

        # pg_conn.transferToDataBase("iris_encoded",df)

        # postgres_hook = PostgresHook(postgres_conn_id="tutorial_pg_conn")
        # conn = postgres_hook.get_conn()
        
        # with conn.cursor() as curs:
        #     curs.execute("select * from {}".format(data_table))
        #     data_records = curs.fetchall()

        
    @task
    def split_data():

        train_percentage = 0.25

        print("""
                Here we should send a request to the docker container that has the python enviroment to divide the data \\n
                """)

    @task
    def train_model():

        kernel_type = 'linear'

        print("""
                Here we should send a request to the docker container that has the training enviroment train the model \\n
                """)

    @task
    def eval_model():

        print("""
                Here we should send a request to the docker container that has the evaluation enviroment for the model \\n
                """)

    get_data()>> encode_data() >> split_data() >> train_model()>> eval_model()



dag = Iris()