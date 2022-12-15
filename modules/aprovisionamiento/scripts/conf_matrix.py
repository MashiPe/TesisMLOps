import sys
import pandas as pd
from sklearn.svm import SVC
from sklearn.model_selection import train_test_split
from joblib import load
import pickle
from sklearn.model_selection import cross_val_score
from sklearn.metrics import confusion_matrix
import json
from config import config
from sqlalchemy import create_engine
if __name__ == '__main__':
    args=sys.argv #{'test_dataset':'iris_svm_test','version':'nombre','ini_file':'iris_svm_v1.ini'}
    json_str = args[1]
    data = json_str.replace("'", '"')
    data1 = json.loads(data)
    test_name=data1["test_dataset"]
    clasifier=load(data1["version"])
    params = config(config_db=data1["ini_file"])
    conn_string = "postgresql://postgres:pass@" + params["host"] + "/" + params["dbname"] + "?user=" + params["user"] + "&password=" + params["password"]
    engine = create_engine(conn_string)
    dataset_test = pd.read_sql_query("select * from " + test_name, con=engine)
    dataset_test.drop('index', inplace=True, axis=1)
    x_test = dataset_test.iloc[:, :-1]
    y_test = dataset_test.iloc[:, -1].values
    #with open(train,"rb") as f:
    #    x_train,y_train=pickle.load(f)
    #with open(test,"rb") as f:
    #    x_test,y_test=pickle.load(f)

    y_pred=clasifier.predict(x_test)
    cm=confusion_matrix(y_test,y_pred)
    print(cm)
