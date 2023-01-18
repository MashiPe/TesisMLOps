import sys
import json

import pandas as pd
from sqlalchemy import create_engine
#base = '/root/scripts/'
from config import config
import pandas
from factor_analyzer.factor_analyzer import calculate_bartlett_sphericity
from factor_analyzer.factor_analyzer import calculate_kmo
from factor_analyzer import FactorAnalyzer
import matplotlib.pyplot as plt
#base="/root/scripts/"
base=""
if __name__ == '__main__':#{*table_input*:*encuestas_encoded*,*file_output*:*likert.jpg*,*ini_file*:*iris_svm_v1.ini*,*columns*:[*Q01*,*Q02*,*Q03*,*Q04*,*Q05*,*Q06*,*Q07*,*Q08*,*Q09*,*Q10*,*Q11*,*Q12*,*Q13*,*Q14*,*Q15*,*Q16*,*Q17*,*Q18*,*Q19*,*Q20*,*Q21*,*Q22*,*Q23*,*Q24*,*Q25*,*Q26*,*Q27*,*Q28*,*Q29*,*Q30*,*Q31*,*Q32*,*Q33*,*Q34*,*Q35*,*Q36*]}
    args = sys.argv
    json_str = args[1]
    print(json_str)
    data = json_str.replace("*", '"')
    data1 = json.loads(data)
    dataset_name = data1["table_input"]
    columns = data1["columns"]
    print(columns)
    out_name = data1["file_output"]
    params = config(config_db=base + data1["ini_file"])
    conn_string = "postgresql://postgres:pass@" + params["host"] + "/" + params["dbname"] + "?user=" + params["user"] + "&password=" + params["password"]
    engine = create_engine(conn_string)
    dataset = pandas.read_sql_query("select * from " + dataset_name.lower(), con=engine)  # leer de base de datos
    dataset.drop('index', inplace=True, axis=1)
    dataset = dataset[columns]
    chi2, p = calculate_bartlett_sphericity(dataset)
    print("Chi squared value : ", chi2)
    print("p value : ", p)
    kmo_vars, kmo_model = calculate_kmo(dataset)
    print(kmo_model)
    fa = FactorAnalyzer(rotation=None, impute="drop", n_factors=dataset.shape[1])
    fa.fit(dataset)
    ev, _ = fa.get_eigenvalues()
    plt.scatter(range(1, dataset.shape[1] + 1), ev)
    plt.plot(range(1, dataset.shape[1] + 1), ev)
    plt.title('Scree Plot')
    plt.xlabel('Factors')
    plt.ylabel('Eigen Value')
    plt.grid()
    plt.savefig("factores.jpg")