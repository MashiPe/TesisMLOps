import sys
import pandas as pd
from sklearn.svm import SVC
from sklearn.model_selection import train_test_split
from joblib import dump
import pickle
import json
from config import config
from sqlalchemy import create_engine

if __name__ == '__main__':
    args=sys.argv #{'train_dataset':'iris_svm_train','test_dataset':'iris_svm_test','kernel':'linear','version':'nombre','ini_file':'iris_svm_v1.ini'}
    json_str = args[1]
    data = json_str.replace("'", '"')
    data1 = json.loads(data)
    kernel=data1["kernel"]
    train_name=data1["train_dataset"]
    test_name=data1["test_dataset"]
    version_name=data1["version"]
    #split=float(args[3])
    params = config(config_db=data1["ini_file"])
    conn_string = "postgresql://postgres:pass@" + params["host"] + "/" + params["dbname"] + "?user=" + params["user"] + "&password=" + params["password"]
    engine = create_engine(conn_string)
    dataset_train = pd.read_sql_query("select * from " + train_name, con=engine)
    dataset_train.drop('index', inplace=True, axis=1)
    x_train=dataset_train.iloc[:,:-1]
    y_train=dataset_train.iloc[:,-1].values

    clasifier=SVC(kernel=kernel)
    clasifier.fit(x_train,y_train)
    s=dump(clasifier,version_name)
    #with open("train.csv","wb") as f:
    #    pickle.dump([x_train , y_train], f)
    #with open("test.csv","wb") as f:
    #    pickle.dump([x_test,y_test], f)