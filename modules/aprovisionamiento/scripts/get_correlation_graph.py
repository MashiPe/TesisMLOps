import pandas as pd
import seaborn as sns
import matplotlib.pyplot as plt
import json
import sys
from config import config
from sqlalchemy import create_engine
base="/root/scripts/"
images="/root/images/"
if __name__ == '__main__': #{*table_input*:*iris_svm_encoded*,*table_output*:*correlation*,*output*:*correlacion.jpg*,*ini_file*:*iris_svm_v1.ini*,*columns*:[*Q01*,*Q02*,*Q03*,*Q04*,*Q05*,*Q06*,*Q07*,*Q08*,*Q09*,*Q10*,*Q11*,*Q12*,*Q13*,*Q14*,*Q15*,*Q16*,*Q17*,*Q18*,*Q19*,*Q20*,*Q21*,*Q22*,*Q23*,*Q24*,*Q25*,*Q26*,*Q27*,*Q28*,*Q29*,*Q30*,*Q31*,*Q32*,*Q33*,*Q34*,*Q35*,*Q36*]}
    args = sys.argv
    json_str = args[1]
    data = json_str.replace("*", '"')
    data1 = json.loads(data)
    dataset_name = data1["table_input"]
    params = config(config_db=base+data1["ini_file"])
    conn_string = "postgresql://postgres:pass@" + params["host"] + "/" + params["dbname"] + "?user=" + params["user"] + "&password=" + params["password"]
    engine = create_engine(conn_string)
    #columns=data1['columns']
    dataset = pd.read_sql_query("select * from " + dataset_name.lower(), con=engine)
    # dataset.drop('level_0',inplace=True,axis=1)
    dataset.drop('index', inplace=True, axis=1)
    #dataset=dataset[columns]
    #print(dataset.corr())
    matrix_corr=dataset.corr()
    dataplot=sns.heatmap(dataset.corr(),cmap="YlGnBu",annot=True)
    # print()
    #plt.show() #guardar_archivo y shiny
    matrix_corr.to_sql(data1['table_output'],con=engine,if_exists="replace")
    plt.savefig(images+data1['version']+'/'+data1['table_output']+".png")