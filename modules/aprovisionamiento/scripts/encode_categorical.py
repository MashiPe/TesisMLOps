import sys
import json

import pandas as pd
from sqlalchemy import create_engine
#base = '/root/scripts/'
from config import config
import pandas
base="/root/scripts/"
#base=""
if __name__ == '__main__': #{*table_input*:*encuestas_database*,*table_output*:*encuestas_encoded*,*ini_file*:*iris_svm_v1.ini*,*columns*:[{*Localidad*:{*1*:*localidad1*,*2*:*localidad2*,*3*:*localidad3*,*4*:*localidad4*,*5*:*localidad5*,*6*:*localidad6*,*7*:*localidad7*,*8*:*localidad8*}},{*Genero*:{*1*:*masculino*,*2*:*femenino*,*3*:*prefiero_no_decirlo*}},{*LugarTrabajo*:{*1*:*dentro_de_la_comunidad*,*2*:*fuera_de_la_comunidad*}}]}
    args=sys.argv
    json_str=args[1]
    print(json_str)
    data=json_str.replace("*",'"')
    data1=json.loads(data)
    dataset_name=data1["table_input"]#{'table_input':'iris_svm_csv_to_database','table_output':'iris_svm_encoded','ini_file':'iris_svm_v1.ini','column':'class','values':{'clave1':'valor1'}}
    columns=data1["columns"]

    out_name = data1["table_output"]
    #values=data1["values"]
    #print(values)
    params = config(config_db=base+data1["ini_file"])
    conn_string = "postgresql://postgres:pass@" + params["host"] + "/" + params["dbname"] + "?user=" + params["user"] + "&password=" + params["password"]
    engine = create_engine(conn_string)
    dataset=pandas.read_sql_query("select * from "+dataset_name.lower(),con=engine) #leer de base de datos
    print("dataset from database",dataset.info())
    dataset.drop('index', inplace=True, axis=1)
    print("dataset info", dataset.info())
    #categories=dataset[column].unique()
    #replace_to={}
    #k=1
    #for i in categories:
    #    replace_to[i]=k
    #    k=k+1
    #print(replace_to)
    for i in columns:
        key=list(i.keys())[0]
        print(key)
        print(len(key))
        interno=i[key]
        print(interno)
        interno_prim=list(interno.keys())[0]
        print(type(interno_prim))
        print("table dtypes",dataset.dtypes)
        print("column dtype")
        print(dataset.dtypes[key])


        ccorrect_type=dataset.dtypes[key]
        i_type=pd.DataFrame(interno,index=[0]).dtypes[interno_prim]
        print(i_type)
        claves_interno=list(interno.keys())
        if(ccorrect_type!=i_type):
            if ccorrect_type=="int64" :
                for j in claves_interno:
                    interno[int(j)] = interno.pop(j, interno[j])
        dataset=dataset.replace({key:interno})
    print(out_name)
    dataset.to_sql(data1["table_output"].lower(), con=engine, if_exists="replace")
    #dataset.to_csv(base+out_name)#escribir en base de datos
    #print(dataset.head())