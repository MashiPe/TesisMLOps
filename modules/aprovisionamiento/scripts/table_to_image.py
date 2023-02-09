import sys
import json
from sqlalchemy import create_engine
#base = '/root/scripts/'
from config import config
import plotly.graph_objects as go
import pandas
import numpy as np
import matplotlib.pyplot as plt
import subprocess
from pdf2image import convert_from_path
#import dataframe_image as dfi
base="/root/scripts/"
#base=""
images="/root/images/"

if __name__ == '__main__': #{*table_input*:*iris_svm_csv_to_database*,*image_output*:*iris_svm_sumary*,*ini_file*:*iris_svm_v1.ini*}
    args = sys.argv
    json_str = args[1]
    data = json_str.replace("*", '"')
    data1 = json.loads(data)
    dataset_name = data1["table_input"]
    params = config(config_db=base + data1["ini_file"])
    conn_string = "postgresql://postgres:pass@" + params["host"] + "/" + params["dbname"] + "?user=" + params["user"] + "&password=" + params["password"]
    engine = create_engine(conn_string)
    dataset = pandas.read_sql_query("select * from " + dataset_name.lower(), con=engine)
    dataset1=dataset.head().copy()
    dataset1.drop('index', inplace=True, axis=1)
    table = go.Table(
        header=dict(values=dataset1.columns.tolist()),
        cells=dict(values=dataset1.T.values)
    )

    fig = go.Figure(data=table).update_layout()
    fig.write_image(images + data1['version'] + '/' + dataset_name.lower() + ".png")
