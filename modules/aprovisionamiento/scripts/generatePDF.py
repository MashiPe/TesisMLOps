from fpdf import FPDF

import pandas as pd
import seaborn as sns
import matplotlib.pyplot as plt
import json
import sys
from config import config
from sqlalchemy import create_engine
base="/root/scripts/"
images="/root/images/"
if __name__ == '__main__':#{*experimento*:*SVM*,*1*:{*grafico*:*Pair_Plot*,*archivo*:*.png*},*2*:{*grafico*:*Pair_plot2*,*archivo*:*.png*}}
    args = sys.argv
    json_str = args[1]
    print(json_str)
    data = json_str.replace("*", '"')
    data1 = json.loads(data)
    nombre_experimento=data1["experimento"]
    pasos=list(data1.keys())
    pasos.pop(0)
    pdf = FPDF()
    pdf.add_page()
    pdf.set_font('Arial', 'B', 24)
    pdf.cell(w=0, h=20, txt="Titulo", ln=1)
    pdf.set_font('Arial', '', 16)
    ch=8
    pdf.cell(w=40, h=ch, txt="Fecha: ", ln=0)
    pdf.cell(w=40, h=ch, txt="01/01/2022", ln=1)
    pdf.cell(w=40, h=ch, txt="Experimento: ", ln=0)
    pdf.cell(w=40, h=ch, txt=nombre_experimento, ln=1)
    pdf.ln(ch)
    for i in pasos:
        exp_dic=data1[i]
        nombre_grafico=exp_dic["grafico"]
        archivo=exp_dic["archivo"]
        pdf.add_page()
        pdf.set_font('Arial', 'B', 24)
        pdf.multi_cell(w=0, h=10, txt=nombre_grafico)
        #pdf.ln(ch)
        pdf.image(archivo,x=0,y=None,w=200,h=0,type="PNG")
    #pdf.add_page()
    #pdf.multi_cell(w=0, h=5, txt="Holi")
    pdf.output(images+'reporte'+'_'+nombre_experimento+'.pdf', 'F')