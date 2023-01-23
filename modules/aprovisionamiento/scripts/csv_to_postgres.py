import sys
from db_conn import load_db_table
from config import get_project_root,config
import pandas
#import psycopg
import json
from sqlalchemy import create_engine
import ast
#base="/root/scripts/"
base=""
if __name__ == '__main__':
    args=sys.argv
    data_str=args[1] #{*csv*:*iris2.csv*,*table_output*:*iris_svm_csv_to_database*,*ini_file*:*iris_svm_v1.ini*,*sep*:*;*} agregar sep
    print("original-data",data_str)
    data=data_str.replace("*",'"')
    data1=json.loads(data)
    print(data)
    print(data1["ini_file"])
    params=config(config_db=base+data1["ini_file"])
    print("params",params)
    conn_string = "postgresql://postgres:pass@" + params["host"]+"/"+params["dbname"]+"?user="+params["user"]+"&password="+params["password"]
    print(params)
    dataset = pandas.read_csv(base + data1["csv"],sep=data1["sep"])
    engine =create_engine(conn_string)
    dataset.to_sql(data1["table_output"].lower(),con=engine,if_exists="replace")


