from flask import Flask
from flask import request
import subprocess
import os
from aprovisionamiento import Aprovisionamiento
app = Flask(__name__)


@app.route('/')
def hello_world():
    return 'Hello World'

@app.route('/ejecutarpipeline')
def ejecutapipeline():
    pass
@app.route('/crearpipeline')
def crearpipeline():
    pass

@app.route('/insertarGraph/<experimento>',methods=['POST'])
def insertargraphdb(experimento):
    print(experimento)
    print(request.get_json())
    return "holi"

@app.route('/desplegar',methods=['POST'])
def desplegarservicios():
    servicios=request.get_json()
    lista=servicios["servicios"]
    aprovisionamiento=Aprovisionamiento(lista)
    aprovisionamiento.start()
    return "0"


if __name__ == '__main__':
    app.run('0.0.0.0', 4000)
