import sys
import json

import pandas as pd
from sqlalchemy import create_engine
#base = '/root/scripts/'
from config import config
import pandas
from sklearn.decomposition import PCA
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.preprocessing import scale

from factor_analyzer.factor_analyzer import calculate_bartlett_sphericity
from factor_analyzer.factor_analyzer import calculate_kmo
from factor_analyzer import FactorAnalyzer
import matplotlib.pyplot as plt
base="/root/scripts/"
#base=""
#https://scikit-learn.org/stable/auto_examples/decomposition/plot_varimax_fa.html
if __name__ == '__main__':#{*table_input*:*encuestas_encoded*,*components*:*9*,*file_output*:*likert.jpg*,*ini_file*:*iris_svm_v1.ini*}
    args = sys.argv
    json_str = args[1]
    print(json_str)
    data = json_str.replace("*", '"')
    data1 = json.loads(data)
    dataset_name = data1["table_input"]
    #columns = data1["columns"]
    #print(columns)
    out_name = data1["file_output"]
    params = config(config_db=base + data1["ini_file"])
    conn_string = "postgresql://postgres:pass@" + params["host"] + "/" + params["dbname"] + "?user=" + params["user"] + "&password=" + params["password"]
    engine = create_engine(conn_string)
    dataset = pandas.read_sql_query("select * from " + dataset_name.lower(), con=engine)  # leer de base de datos
    dataset.drop('index', inplace=True, axis=1)
    #dataset = dataset[columns]
    pca = PCA(n_components=int(data1['components']))
    mtrix_corr=dataset.corr()
    print(mtrix_corr.head())
    features=pca.fit_transform(mtrix_corr)
    lista = ['PC' + str(i) for i in range(1, 10)]
    pca_df = pd.DataFrame(
        data=features,
        columns=lista,
        index=mtrix_corr.index
    )
    pca_df.to_sql(data1["file_output"].lower(), con=engine, if_exists="replace")





