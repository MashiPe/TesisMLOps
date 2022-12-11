import sys

import pandas
if __name__ == '__main__':
    args=sys.argv
    column=args[1]
    dataset_name=sys.argv[2]
    dataset=pandas.read_csv(dataset_name) #leer de base de datos
    categories=dataset[column].unique()
    replace_to={}
    k=1
    for i in categories:
        replace_to[i]=k
        k=k+1
    #print(replace_to)
    dataset=dataset.replace({column:replace_to})
    dataset.to_csv(dataset_name+"_encoded")#escribir en base de datos
    #print(dataset.head())