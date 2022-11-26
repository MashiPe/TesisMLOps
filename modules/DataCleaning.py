import pandas as pd
import numpy as np

class DataCleaning():

    def dropColumns(self, df: pd.DataFrame, columnas: list):
        df.drop(columns=columnas, inplace=True)
        return df

    def defid(self, df: pd.DataFrame, column):
        try:
            if df[column].is_unique:
                df = df.set_index(column)
                return df

        except KeyError:
            raise
    #https://www.geeksforgeeks.org/working-with-missing-data-in-pandas/#:~:text=In%20order%20to%20check%20missing,null%20values%20in%20a%20series.
    def restoreMissing(self,df: pd.DataFrame,type:str,value=0.0,column='',method='bfill'):
        if type=='drop':
            df = df[df[column].notna()]
            # df=df.dropna()
            return df
        elif type=='replace':
            df=df.replace(to_replace=np.NAN,value=value)
            return df
        elif type=='fill':
            df2=df[column].fillna(method=method)
            df[column]=df2
            return df

    
    


if __name__ == '__main__':
    df = pd.read_csv('/home/daniel/test2.csv')
    print(df.head())
    cleaning = DataCleaning()
    print(cleaning.dropColumns(df=df, columnas=['column2']))
    try:
        print(cleaning.defid(df=df, column='column2'))
    except KeyError:
        print("Los indices no son unicos")

    print(cleaning.restoreMissing(df,'fill',value=1,column='column4',method='pad'))
