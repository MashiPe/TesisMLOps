import csv
from tableschema import Table,infer

# data ="./dags/files/employees.csv"

# schema = infer(data,limit=500, headers=1,confidence=0.85)

# print(schema)


def inferScheme( csv_path ):

    schema = infer(csv_path,limit=500,headers=1, confidence=0.85)

    return schema



