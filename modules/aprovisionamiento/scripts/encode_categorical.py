import sys
import json
from sqlalchemy import create_engine
#base = '/root/scripts/'
from config import config
import pandas

if __name__ == '__main__':
    args=sys.argv
    json_str=args[1]
    data=json_str.replace("'",'"')
    data1=json.loads(data)
    dataset_name=data1["table_input"]#{'table_input':'iris_svm_csv_to_database','table_output':'iris_svm_encoded','ini_file':'iris_svm_v1.ini','column':'class','values':{'clave1':'valor1'}}
    column=data1["column"]
    out_name = data1["table_output"]
    values=data1["values"]
    print(values)
    params = config(config_db=data1["ini_file"])
    conn_string = "postgresql://postgres:pass@" + params["host"] + "/" + params["dbname"] + "?user=" + params["user"] + "&password=" + params["password"]
    engine = create_engine(conn_string)
    dataset=pandas.read_sql_query("select * from "+dataset_name,con=engine) #leer de base de datos
    dataset.drop('index', inplace=True, axis=1)
    categories=dataset[column].unique()
    #replace_to={}
    #k=1
    #for i in categories:
    #    replace_to[i]=k
    #    k=k+1
    #print(replace_to)
    dataset=dataset.replace({column:values})
    print(out_name)
    dataset.to_sql(data1["table_output"], con=engine, if_exists="replace")
    #dataset.to_csv(base+out_name)#escribir en base de datos
    #print(dataset.head())