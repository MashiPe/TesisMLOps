import sys
import json
from sqlalchemy import create_engine
#base = '/root/scripts/'
from config import config
from sklearn.cluster import KMeans
import pandas as pd
from joblib import dump
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from pandas.plotting import parallel_coordinates
base="/root/scripts/"
#base=""
if __name__ == '__main__':
    args = sys.argv  # {'train_dataset':'iris_svm_noclass','k':3,'version':'nombre','ini_file':'iris_svm_v1.ini'}
    json_str = args[1]
    data = json_str.replace("*", '"')
    data1 = json.loads(data)
    k = data1["k"]
    train_name = data1["train_dataset"]
    #test_name = data1["test_dataset"]
    version_name = data1["version"]
    # split=float(args[3])
    params = config(config_db=base+data1["ini_file"])
    conn_string = "postgresql://postgres:pass@" + params["host"] + "/" + params["dbname"] + "?user=" + params["user"] + "&password=" + params["password"]
    engine = create_engine(conn_string)
    dataset_train = pd.read_sql_query("select * from " + train_name.lower(), con=engine)
    dataset_train.drop('index', inplace=True, axis=1)
    kmeans=KMeans(n_clusters=k,max_iter=300,n_init=50)
    y_kmeans=kmeans.fit(dataset_train)
    labels=kmeans.fit_predict(dataset_train)
    dataset_resp=dataset_train.copy()
    dataset_resp.loc[:,"cluster"]=kmeans.labels_
    dataset_resp.to_sql(data1["table_output"].lower(),con=engine,if_exists="replace")
    s = dump(kmeans, base + version_name)
    # Getting unique labels

    #parallel_coordinates(dataset_resp, 'cluster', colormap=plt.get_cmap("Set2"))
    #plt.show()