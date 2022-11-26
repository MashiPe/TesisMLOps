import pandas as pd
from urllib import parse

POSTGRES = 1


baseURL = {1:'postgresql://'}


def readTable(user,password,database,table,dbms,host = 'localhost'):

    # print(baseURL['1'])

    URI = '{dbms}{user}:{password}@{host}/{database}'.format(
        dbms = baseURL[dbms],
        user = user,
        password = parse.quote(password),
        host = host,
        database = database,   
    )

    dataframe = pd.read_sql_table(table,URI)

    return dataframe


