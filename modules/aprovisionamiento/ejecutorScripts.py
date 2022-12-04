from flask import Flask
import subprocess
import os
from flask import request
import logging

app = Flask(__name__)

@app.route('/ejecutarpython/<script>', methods=['POST'])
def ejecutar(script):
    result_ls=os.system("ls /root/scripts")
    print("nombre_script: "+script)
    app.logger.info(result_ls)
    parametros=request.get_json()["parametros"]
    parametros_str=""
    for i in parametros:
        parametros_str=parametros_str+" "+i
    print("parametros enviados: "+parametros_str)
    output = subprocess.call(['python3',"/root/scripts/"+script,parametros_str])
    print("respuesta: "+str(output))
    return str(result_ls)

@app.route('/ejecutarR/<script>',methods=['POST'])
def ejecutarR(script):
    pass


if __name__ == '__main__':
    logging.basicConfig(filename='./error.log', level=logging.DEBUG)
    app.run('0.0.0.0', 4001,debug=True)