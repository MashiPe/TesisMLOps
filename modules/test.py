from modules.utils.database import database_utils
from modules.utils.database.postgres_connector import PostgresConnector


user = 'airflow'
password = 'airflow'
database = 'airflow'
table = 'employees'


df = database_utils.readTable(user,password,database,table,database_utils.POSTGRES)

meta = df.info(verbose=True)
# print(df)
print(meta)

connector = PostgresConnector('localhost',database,user,password)

df_0 = connector.readTable(table)

# print('Result df')
# meta = df_0.info(verbose=True)
# print(meta)

connector.transferToDataBase('test',df_0)