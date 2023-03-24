import yaml
from yaml import BaseLoader, SafeDumper
import os
from threading import *
import subprocess
class Aprovisionamiento(Thread):

    def __init__(self,lista):
        super(Aprovisionamiento, self).__init__()
        SafeDumper.add_representer(
            type(None),
            lambda dumper, value: dumper.represent_scalar(u'tag:yaml.org,2002:null', '')
        )
        self.lista=lista
    def llenardockercompose(self,servicios):
        dicionario={"services":{}}
        print("ls: "+str(os.system("p")))
        for i in servicios:
            if(i=="mongodb"):
                mongo={"mongodb":{"image":"mongo:latest",
                                                   "container_name": "mongodb",
                                                   "ports":["27017:27017"],
                                                   "environment":["MONGO_INITDB_DATABASE=test",
                                                                  "MONGO_INITDB_ROOT_USERNAME=admin",
                                                                  "MONGO_INITDB_ROOT_PASSWORD=admin",],
                                                   "volumes":["./mongo-entrypoint/mongo-init.js:/docker-entrypoint-initdb.d/mongo-init.js:ro",
                                                              "mongodb:/data/db",
                                                              "mongoconfig:/data/configdb"]}}
                volumesmongo={"mongodb":None,"mongoconfig":None}
                dicionario["services"]=mongo
                dicionario["volumes"]=volumesmongo
            if(i=="python"):
                python={"image":"seaman69/ejecutor_scripts:v1",
                        "ports":["4001:4001"],
                        "volumes":["./scripts:/root/scripts","~/images:/root/images"],
                        "container_name":"ejecutor",
                        "networks": ["airflow_flow-net"]
                        }
                dicionario["services"]["web"]=python
        
        dicionario["networks"]= {"airflow_flow-net":{"external" : True}}
        return dicionario
    def ejecutardockercompose(self):
        #os.system("docker-compose up")

        #os.popen('docker-compose -f aprovisionamiento/docker-compose.yml up').read()
        output = subprocess.call(['docker-compose', "-f", "aprovisionamiento/docker-compose.yml","up"])

    def detener_dockercompose(self):
        os.popen('docker-compose stop')

    def removerdockercompose(self):
        os.popen('docker-compose down')

    SafeDumper.add_representer(
            type(None),
            lambda dumper, value: dumper.represent_scalar(u'tag:yaml.org,2002:null','')
        )

    def run(self):

        with open('aprovisionamiento/docker-compose.yml', 'w') as outfile:
            yaml.safe_dump(self.llenardockercompose(self.lista), outfile, default_flow_style=False)
        #self.ejecutardockercompose() #ejecutar en otro hilo
        thread=Thread(target=self.ejecutardockercompose)
        thread.start()
        print(os.system("ls"))
        #si falla, ejecutar script que mate todos los contenedores
        print("algo paso")