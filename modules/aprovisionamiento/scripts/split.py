import sys
import json
from sqlalchemy import create_engine
#base = '/root/scripts/'
from config import config
from sklearn.model_selection import train_test_split
import pandas

base="/root/scripts/"
if __name__ == '__main__':
    args = sys.argv
    json_str = args[1]
    data = json_str.replace("*", '"')
    print(data)
    data1 = json.loads(data)
    dataset_name = data1["table_input"]  # {'table_input':'iris_svm_encoded','table_train':'iris_svm_train','table_test':'iris_svm_test','ini_file':'iris_svm_v1.ini','size'=0.25}
    #agregar randomstate
    train_name = data1["table_train"]
    test_name=data1 ["table_test"]
    split=data1["size"]
    params = config(config_db=base+data1["ini_file"])
    conn_string = "postgresql://postgres:pass@" + params["host"] + "/" + params["dbname"] + "?user=" + params["user"] + "&password=" + params["password"]
    engine = create_engine(conn_string)
    dataset = pandas.read_sql_query("select * from " + dataset_name.lower(), con=engine)
    #dataset.drop('level_0',inplace=True,axis=1)
    dataset.drop('index',inplace=True,axis=1)
    #x = dataset.iloc[:, :-1]
    #y = dataset.iloc[:, -1].values
    #x_train, x_test, y_train, y_test = train_test_split(x, y, test_size=split)
    #print(y_train)
    training_data = dataset.sample(frac=1-split)
    print(training_data.head())
    testing_data = dataset.drop(training_data.index)
    training_data.to_sql(train_name.lower(),con=engine,if_exists='replace')
    testing_data.to_sql(test_name.lower(),con=engine,if_exists='replace')