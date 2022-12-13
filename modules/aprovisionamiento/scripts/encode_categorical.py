import sys

base = '/root/scripts/'

import pandas
if __name__ == '__main__':
    args=sys.argv
    dataset_name=args[1]
    column=args[2]
    out_name = args[3]
    dataset=pandas.read_csv(base+dataset_name) #leer de base de datos
    categories=dataset[column].unique()
    replace_to={}
    k=1
    for i in categories:
        replace_to[i]=k
        k=k+1
    #print(replace_to)
    dataset=dataset.replace({column:replace_to})
    print(out_name)
    dataset.to_csv(base+out_name)#escribir en base de datos
    #print(dataset.head())