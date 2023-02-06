import sys
from db_conn import load_db_table
from config import get_project_root,config
import pandas
#import psycopg
import json
from sqlalchemy import create_engine
import ast
base="/root/scripts/"
#base=""
inipersistency="persistency_docker.ini"
if __name__ == '__main__':

    args = sys.argv
    data_str = args[1]  # {*table_input*:*irisdatasetv1*,*table_output*:*table*,*ini_file*:*iris_svm_v1.ini*} agregar sep
    print("original-data", data_str)
    data = data_str.replace("*", '"')
    data1 = json.loads(data)
    dataset_name = data1["table_input"]
    print(data)
    print(data1["ini_file"])
    params = config(config_db=base+inipersistency)
    print("params", params)
    conn_string = "postgresql://postgres:pass@" + params["host"] + "/" + params["dbname"] + "?user=" + params["user"] + "&password=" + params["password"]
    print("Conection string: ",conn_string)
    engine = create_engine(conn_string)
    dataset = pandas.read_sql_query("select * from " + dataset_name.lower(), con=engine)  # leer de base de datos
    dataset.drop('index', inplace=True, axis=1)
    params2 = config(config_db=base + data1["ini_file"])
    print("params", params2)
    conn_string = "postgresql://postgres:pass@" + params2["host"] + "/" + params2["dbname"] + "?user=" + params2["user"] + "&password=" + params2["password"]
    engine2 = create_engine(conn_string)
    dataset.to_sql(data1["table_output"].lower(), con=engine2, if_exists="replace")
