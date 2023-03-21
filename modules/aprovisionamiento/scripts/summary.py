import sys
import json
from sqlalchemy import create_engine
#base = '/root/scripts/'
from config import config
import pandas
import plotly.graph_objects as go
base="/root/scripts/"
#base=""
if __name__ == '__main__': #{*table_input*:*iris_svm_csv_to_database*,*table_output*:*iris_svm_sumary*,*ini_file*:*iris_svm_v1.ini*}
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
    sumary=dataset.describe()
    engine = create_engine(conn_string)
    sumary.to_sql(data1["table_output"].lower(), con=engine, if_exists="replace") #imagen
    df_table = dataset.reset_index()
    #df_table.loc[df_table[data1["groupby"][0]].duplicated(), data1["groupby"][0]] = ''

    table = go.Table(
        header=dict(values=df_table.columns.tolist()),
        cells=dict(values=df_table.T.values)
    )

    fig = go.Figure(data=table).update_layout()
    fig.write_image(data1["table_output"]+".jpg")