#!/bin/bash

cd ./airflow

docker compose up &

cd ../modules

python controladorAPIREST.py &

cd raidenUI

npm run dev &