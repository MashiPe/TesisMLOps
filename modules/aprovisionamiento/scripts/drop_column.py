import sys
import json
from sqlalchemy import create_engine
#base = '/root/scripts/'
from config import config
import pandas


if __name__ == '__main__':
    args = sys.argv
    json_str = args[1]
    data = json_str.replace("'", '"')
    data1 = json.loads(data)
    dataset_name = data1["table_input"]  # {'table_input':'iris_svm_csv_to_database','table_output':'iris_svm_encoded','ini_file':'iris_svm_v1.ini','columns':['col1','col2']}
    #column = data1["column"]
    out_name = data1["table_output"]
    columns = data1["columns"]
    #print(type(columns))
    params = config(config_db=data1["ini_file"])
    conn_string = "postgresql://postgres:pass@" + params["host"] + "/" + params["dbname"] + "?user=" + params["user"] + "&password=" + params["password"]
    engine = create_engine(conn_string)
    dataset = pandas.read_sql_query("select * from " + dataset_name, con=engine)  # leer de base de datos
    dataset.drop('index', inplace=True, axis=1)
    for i in  columns:
        print(i)
        dataset.drop(i,inplace=True,axis=1)
    dataset.to_sql(data1["table_output"], con=engine, if_exists="replace")
