from modules.utils.database.connector_interface import ConnectorInterface
import psycopg2
import pandas as pd
import numpy as np
from sqlalchemy import create_engine

from modules.utils.database import database_utils 

class PostgresConnector(ConnectorInterface):

    type_map = { 'numeric':  np.float64 , 'integer': np.int64,'text': str}
    reverse_type_map = { np.dtype(np.float64) : 'numeric' ,np.dtype(np.object_) : 'text', np.dtype(np.int64) : 'integer'}

    def __init__(self,hostname:str,database:str,user:str,password:str,port='5432'):

        self.hotsname = hostname
        self.database = database
        self.user = user
        self.password = password
        self.port = port

    
    def describeTable(self,table:str):
        
        conn = psycopg2.connect(
                  database=self.database, user=self.user, password=self.password, host=self.hotsname, port=self.port)

        cursor = conn.cursor()

        cursor.execute(""" SELECT column_name,data_type 
                            FROM information_schema.columns 
                            WHERE table_name = \'{}\'; """.format(table))
        
        res = cursor.fetchall()

        print(res)

        conn.close()
        return res


    def readTable(self,table:str):
        
        
        df = database_utils.readTable(self.user,sejlf.password,self.database,table,database_utils.POSTGRES,self.hotsname)
        description = self.describeTable(table)

        for des in description:
            # print(self.type_map[des[1]])
            df[des[0]] = df[des[0]].astype(self.type_map[des[1]]) 

        return df

    def transferToDataBase(self,tablename,dataframe):

        conn = psycopg2.connect(
                  database=self.database, user=self.user, password=self.password, host=self.hotsname, port=self.port)

        cursor = conn.cursor()

        table_query = "CREATE TABLE "+ tablename + "("

        for col in dataframe.columns:

            print(col)
            print(self.reverse_type_map[dataframe[col].dtype])
            table_query = table_query + "\"" + col+ "\" " + self.reverse_type_map[dataframe[col].dtype] + ","

        table_query = table_query[:-1] + ");"

        cursor.execute(table_query)

        conn.commit()
        conn.close()

        engine = create_engine('postgresql+psycopg2://{}:{}@{}:{}/{}'.format(self.user,self.password,self.hotsname,self.port,self.database))

        dataframe.to_sql(tablename,engine,if_exists = 'replace') 

        pass