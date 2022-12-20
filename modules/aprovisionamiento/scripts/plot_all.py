import pandas as pd
import seaborn as sns
import matplotlib.pyplot as plt
import json
import sys
from config import config
from sqlalchemy import create_engine
base="/root/scripts/"
if __name__ == '__main__':
    args = sys.argv
    json_str = args[1]
    data = json_str.replace("*", '"')
    data1 = json.loads(data)
    dataset_name = data1["table_input"]
    fig_output=data1["output"]
    params = config(config_db=base+data1["ini_file"])
    conn_string = "postgresql://postgres:pass@" + params["host"] + "/" + params["dbname"] + "?user=" + params["user"] + "&password=" + params["password"]
    engine = create_engine(conn_string)
    dataset = pd.read_sql_query("select * from " + dataset_name.lower(), con=engine)
    # dataset.drop('level_0',inplace=True,axis=1)
    dataset.drop('index', inplace=True, axis=1)
    sns_plot=sns.pairplot(dataset)
    fig = sns_plot.savefig("")
    #fig.savefig("output.png")