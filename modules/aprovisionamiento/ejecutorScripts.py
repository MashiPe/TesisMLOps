from flask import Flask
import subprocess
import os
app = Flask(__name__)

@app.route('/ejecutarpython/<script>', methods=['POST'])
def ejecutar(script):
    print(os.system("ls /root/"))
    print(script)
    output = subprocess.call(['python3',script])
    return "0"

@app.route('/ejecutarR/<script>',methods=['POST'])
def ejecutarR(script):
    pass


if __name__ == '__main__':
    app.run('0.0.0.0', 4001)