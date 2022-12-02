import yaml
from yaml import BaseLoader, SafeDumper
import os
from threading import *
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
        for i in servicios:
            if(i=="mongodb"):
                mongo={"mongodb":{"image":"mongo:4.2.3-bionic",
                                                   "container_name": "mongodb",
                                                   "ports":["27017:27017"],
                                                   "environment":["MONGO_INITDB_DATABASE=test",
                                                                  "MONGO_INITDB_ROOT_USERNAME=admin",
                                                                  "MONGO_INITDB_ROOT_PASSWORD=admin"],
                                                   "volumes":["./mongo-entrypoint:/docker-entrypoint-initdb.d",
                                                              "mongodb:/data/db",
                                                              "mongoconfig:/data/configdb"]}}
                volumesmongo={"mongodb":None,"mongoconfig":None}
                dicionario["services"]=mongo
                dicionario["volumes"]=volumesmongo
            if(i=="postgres"):
                postgres={"database":{"container_name":"postgres_db",
                                      "image":"postgres",
                                      "ports":["5433:5433"],
                                      "env_file":"database.env"}}
                dicionario["services"]=postgres
            if(i=="python"):
                python={"build":{"context":"",
                                 "dockerfile":"Dockerfile"},
                        "ports":["4001:4001"]}
                dicionario["services"]["web"]=python
        return dicionario
    def ejecutardockercompose(self):
        os.system("docker-compose up")




    SafeDumper.add_representer(
            type(None),
            lambda dumper, value: dumper.represent_scalar(u'tag:yaml.org,2002:null','')
        )

    def run(self):

        with open('docker-compose.yml', 'w') as outfile:
            yaml.safe_dump(self.llenardockercompose(self.lista), outfile, default_flow_style=False)
        self.ejecutardockercompose() #ejecutar en otro hilo
        #thread=Thread(target=self.ejecutardockercompose)
        #thread.start()
        #si falla, ejecutar script que mate todos los contenedores
        print("Servicios levantados")