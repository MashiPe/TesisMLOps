from flask import Flask

import os
from flask import request


app = Flask(__name__)

@app.route('/ejecutarpython/<script>', methods=['POST'])
def ejecutar(script):
    print(os.system("ls /root/scripts"))
    #print("nombre_script: "+script)

    parametros=request.get_json()["parametros"]

    print(parametros)
    parametros_str=""
    for i in parametros:
        parametros_str=parametros_str+" "+i
    #print("parametros enviados: "+parametros_str)
    #output = subprocess.call(['python3',"/root/scripts/"+script,parametros_str])
    print("parametrosaasssssssssssss:" +parametros_str)
    os.system("python3 /root/scripts/"+script+" "+parametros_str)
    #print("respuesta: "+str(output))
    return parametros_str

@app.route('/ejecutarR/<script>',methods=['POST'])
def ejecutarR(script):
    pass


if __name__ == '__main__':
    app.run('0.0.0.0', 4001,debug=False)