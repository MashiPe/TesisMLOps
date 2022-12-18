import sys
import json
from sqlalchemy import create_engine
#base = '/root/scripts/'
from config import config
from sklearn.cluster import KMeans
import pandas as pd


if __name__ == '__main__':
    args = sys.argv  # {'train_dataset':'iris_svm_noclass','k':3,'version':'nombre','ini_file':'iris_svm_v1.ini'}
    json_str = args[1]
    data = json_str.replace("'", '"')
    data1 = json.loads(data)
    k = data1["k"]
    train_name = data1["train_dataset"]
    #test_name = data1["test_dataset"]
    version_name = data1["version"]
    # split=float(args[3])
    params = config(config_db=data1["ini_file"])
    conn_string = "postgresql://postgres:pass@" + params["host"] + "/" + params["dbname"] + "?user=" + params["user"] + "&password=" + params["password"]
    engine = create_engine(conn_string)
    dataset_train = pd.read_sql_query("select * from " + train_name, con=engine)
    dataset_train.drop('index', inplace=True, axis=1)
    kmeans=KMeans(n_clusters=k,max_iter=300)
    y_kmeans=kmeans.fit(dataset_train)
    dataset_train.loc[:,"cluster"]=kmeans.labels_
    dataset_train.to_sql(data1["version"],con=engine,if_exists="replace")