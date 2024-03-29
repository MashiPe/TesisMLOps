import sys
import json

import pandas as pd
from sqlalchemy import create_engine
#base = '/root/scripts/'
from config import config
import pandas
import plot_likert
import seaborn as sns
import matplotlib.pyplot as plt
base="/root/scripts/"
#base=""
images="/root/images/"
if __name__ == '__main__':##{*table_input*:*encuestas_encoded*,*title*:*Preguntax*,*xaxis*:*likert*,*yaxis*:*frecuencia*,*file_output*:*hist.jpg*,*ini_file*:*iris_svm_v1.ini*,*columns*:[*Q01*,*Q02*,*Q03*,*Q04*,*Q05*,*Q06*,*Q07*,*Q08*,*Q09*,*Q10*,*Q11*,*Q12*,*Q13*,*Q14*,*Q15*,*Q16*,*Q17*,*Q18*,*Q19*,*Q20*,*Q21*,*Q22*,*Q23*,*Q24*,*Q25*,*Q26*,*Q27*,*Q28*,*Q29*,*Q30*,*Q31*,*Q32*,*Q33*,*Q34*,*Q35*,*Q36*]}
    args = sys.argv
    json_str = args[1]
    print(json_str)
    data = json_str.replace("*", '"')
    data1 = json.loads(data)
    dataset_name = data1["table_input"]
    columns = data1["columns"]
    print(columns)
    out_name = data1["file_output"]
    params = config(config_db=base + data1["ini_file"])
    conn_string = "postgresql://postgres:pass@" + params["host"] + "/" + params["dbname"] + "?user=" + params["user"] + "&password=" + params["password"]
    engine = create_engine(conn_string)
    dataset = pandas.read_sql_query("select * from " + dataset_name.lower(), con=engine)  # leer de base de datos
    dataset.drop('index', inplace=True, axis=1)
    dataset = dataset[columns]
    #titulo debe ser lo de la tabla
    print("LLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLl")
    for i in columns:
        dataplot=sns.histplot(dataset,x=i,discrete=True,stat="count",kde=True).set(title=i)
        plt.xlabel("xaxis")
        plt.ylabel("yaxis")
        plt.tick_params(axis='x', rotation=90)
        plt.savefig(images +data1["version"]+"/"+ out_name+"_"+i+".jpg", bbox_inches='tight')
        plt.cla()
        plt.clf()