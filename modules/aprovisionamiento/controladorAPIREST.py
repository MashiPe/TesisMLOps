from flask import Flask
import subprocess
import os
app = Flask(__name__)


@app.route('/')
def hello_world():
    return 'Hello World'


@app.route('/ejecutar/<script>', methods=['POST'])
def ejecutar(script):
    print(os.system("ls /root/"))
    print(script)
    output = subprocess.call(['python3',script])
    return "0"


if __name__ == '__main__':
    app.run('0.0.0.0', 4000)
