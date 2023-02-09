import sys
import json

import pandas as pd
from sqlalchemy import create_engine
#base = '/root/scripts/'
from config import config
import pandas
import numpy as np
import matplotlib.pyplot as plt
import subprocess
from pdf2image import convert_from_path
import plotly.graph_objects as go
base="/root/scripts/"
images="/root/images/"

if __name__ == '__main__': #{*table_input*:*iris_svm_csv_to_database*,*table_output*:*iris_svm_sumary*,*ini_file*:*iris_svm_v1.ini*,*groupby*:[*Localidad*,*Genero*],*aggcolumn*:*Genero*,*agg*:*count*}
    args = sys.argv
    json_str = args[1]
    data = json_str.replace("*", '"')
    data1 = json.loads(data)
    dataset_name = data1["table_input"]
    params = config(config_db=base + data1["ini_file"])
    conn_string = "postgresql://postgres:pass@" + params["host"] + "/" + params["dbname"] + "?user=" + params["user"] + "&password=" + params["password"]
    engine = create_engine(conn_string)
    dataset = pandas.read_sql_query("select * from " + dataset_name.lower(), con=engine)  # leer de base de datos
    dataset.drop('index', inplace=True, axis=1)

    dataset=dataset[data1["groupby"]]
    print(data1["groupby"])
    print(data1["aggcolumn"])
    dataset=dataset.groupby(data1["groupby"],as_index=True)[data1["aggcolumn"]].count()
    print(dataset)
    #dataset=dataset.to_frame()
    dataset=dataset.unstack(level=1)
    dataset=dataset.fillna(0)
    print()
    #dataset=dataset.rename({'Genero': 'Count'})
    print(dataset.columns)
    df_table = dataset.reset_index()
    df_table.loc[df_table[data1["groupby"][0]].duplicated(), data1["groupby"][0]] = ''

    table = go.Table(
        header=dict(values=df_table.columns.tolist()),
        cells=dict(values=df_table.T.values)
    )

    fig = go.Figure(data=table).update_layout()
    fig.write_image(images+data1['version']+'/'+dataset_name.lower()+"groupby.png")




    #fig, ax = render_mpl_table(dataset, header_columns=0, col_width=2.0)
    #fig.savefig("table_groupby.png")

