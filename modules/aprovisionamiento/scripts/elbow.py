import sys
import json
import matplotlib.pyplot as plt
import pandas as pd
from sqlalchemy import create_engine
#base = '/root/scripts/'
from config import config
from sklearn.metrics import silhouette_score
import pandas
import seaborn as sns
from sklearn.cluster import KMeans
base="/root/scripts/"
#base=""
images="/root/images/"
if __name__ == '__main__':#{*table_input*:*encuestas_encoded*,*file_output*:*likert.jpg*,*ini_file*:*iris_svm_v1.ini*,*kmin*:*2*,*kmax*:*6*,*columns*:[*Q01*,*Q02*,*Q03*,*Q04*,*Q05*,*Q06*,*Q07*,*Q08*,*Q09*,*Q10*,*Q11*,*Q12*,*Q13*,*Q14*,*Q15*,*Q16*,*Q17*,*Q18*,*Q19*,*Q20*,*Q21*,*Q22*,*Q23*,*Q24*,*Q25*,*Q26*,*Q27*,*Q28*,*Q29*,*Q30*,*Q31*,*Q32*,*Q33*,*Q34*,*Q35*,*Q36*]}
    args = sys.argv
    json_str = args[1]
    print(json_str)
    data = json_str.replace("*", '"')
    data1 = json.loads(data)
    dataset_name = data1["table_input"]
    columns = data1["columns"]
    out_name = data1["file_output"]
    params = config(config_db=base + data1["ini_file"])
    conn_string = "postgresql://postgres:pass@" + params["host"] + "/" + params["dbname"] + "?user=" + params["user"] + "&password=" + params["password"]
    engine = create_engine(conn_string)
    dataset = pandas.read_sql_query("select * from " + dataset_name.lower(), con=engine)
    dataset.drop('index', inplace=True, axis=1)
    dataset=dataset[columns]
    sil=[]
    ks=[]
    for k in range(int(data1["kmin"]), int(data1["kmax"]) + 1):
        kmeans = KMeans(n_clusters=k,n_init=50).fit(dataset)
        centroids = kmeans.cluster_centers_

        sil.append(kmeans.inertia_)
        ks.append(k)

    print(sil)
    dic=dict(zip(ks,sil))
    dataframe=pd.DataFrame(dic.items(), columns=['k', 'score'])
    print(dataframe.head())
    #dataplot = sns.displot(dataframe).set(title="Silhouette_score")
    plt.plot(ks, sil,"-o")
    plt.xlabel("k")
    plt.ylabel("Score")
    plt.title("Elbow Method")
    plt.savefig(images+data1["version"]+"/" + out_name)
