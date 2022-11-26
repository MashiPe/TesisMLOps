from abc import ABC, abstractmethod


class ConnectorInterface(ABC):

    lab_user = 'airflow'
    lab_password = 'airflow'
    lab_database = 'airflow'
    lab_host = 'localhost'

    @abstractmethod
    def describeTable(self,table):
        pass


    @abstractmethod
    def readTable(self,table):
        pass

