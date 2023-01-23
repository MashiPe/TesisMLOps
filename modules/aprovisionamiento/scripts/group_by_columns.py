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
base="/root/scripts/"
#base=""
def render_mpl_table(data, col_width=10.0, row_height=0.625, font_size=14,
                     header_color='#40466e', row_colors=['#f1f1f2', 'w'], edge_color='w',
                     bbox=[0, 0, 1, 1], header_columns=0,
                     ax=None, **kwargs):
    if ax is None:
        size = (np.array(data.shape[::-1]) + np.array([0, 1])) * np.array([col_width, row_height])
        fig, ax = plt.subplots(figsize=size)
        ax.axis('off')
    mpl_table = ax.table(cellText=data.values, bbox=bbox, colLabels=data.columns, **kwargs)
    mpl_table.auto_set_font_size(False)
    mpl_table.set_fontsize(font_size)

    for k, cell in mpl_table._cells.items():
        cell.set_edgecolor(edge_color)
        if k[0] == 0 or k[1] < header_columns:
            cell.set_text_props(weight='bold', color='w')
            cell.set_facecolor(header_color)
        else:
            cell.set_facecolor(row_colors[k[0]%len(row_colors) ])
    return ax.get_figure(), ax
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
    #print(dataset.head(5))
    dataset=dataset[['Genero','LugarTrabajo']]
    print(data1["groupby"])
    dataset=dataset.groupby(data1["groupby"],as_index=True)[data1["aggcolumn"]].count()
    print(dataset)
    #dataset=dataset.to_frame()
    dataset=dataset.unstack(level=1)
    dataset=dataset.fillna(0)
    print()
    #dataset=dataset.rename({'Genero': 'Count'})
    print(dataset.columns)
    print(dataset.to_latex())
    template = r'''\documentclass[preview]{{standalone}}
       \usepackage{{booktabs}}
       \begin{{document}}
       {}
       \end{{document}}
       '''
    with open(base + data1["table_output"] + ".tex", 'w') as f:
        f.write(template.format(dataset.to_latex()))
    # fig,ax = render_mpl_table(dataset1, header_columns=0, col_width=2.0)
    # fig.savefig("table_mpl.png")
    subprocess.call(['pdflatex', base + data1["table_output"] + ".tex"])
    # subprocess.call(['convert', '-density', '300', base+data1["image_output"]+".pdf", '-quality', '90', base+data1["image_output"]+".jpg"])
    images = convert_from_path(base + data1["table_output"] + ".pdf")

    for i in range(len(images)):
        # Save pages as images in the pdf
        images[i].save(base + data1["table_output"] + str(i) + '.jpg', 'JPEG')
    #fig, ax = render_mpl_table(dataset, header_columns=0, col_width=2.0)
    #fig.savefig("table_groupby.png")

