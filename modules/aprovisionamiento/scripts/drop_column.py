import sys
import json
from sqlalchemy import create_engine
from config import config
import pandas

base="/root/scripts/"
if __name__ == '__main__':
    #Obtencion de parametros
    args = sys.argv
    json_str = args[1]
    data = json_str.replace("*", '"')
    data1 = json.loads(data)
    dataset_name = data1["table_input"]  
    out_name = data1["table_output"]
    columns = data1["columns"]
    
    #Lectura de datos

    params = config(config_db=base+data1["ini_file"])
    conn_string = ("postgresql://postgres:pass@" + params["host"] + 
                   "/" + params["dbname"] + "?user=" + params["user"] + 
                   "&password=" + params["password"])
    engine = create_engine(conn_string)
    dataset = pandas.read_sql_query("select * from " + dataset_name.lower(),
                                    con=engine)  
    dataset.drop('index', inplace=True, axis=1)
    
    #Proceso de elimincación

    for i in  columns:
        print(i)
        dataset.drop(i,inplace=True,axis=1)

    #Escritura de datos

    dataset.to_sql(data1["table_output"].lower(), con=engine, if_exists="replace")
