import sys
import pandas as pd
from sklearn.svm import SVC
from sklearn.model_selection import train_test_split
from joblib import dump
import pickle
if __name__ == '__main__':
    args=sys.argv
    dataset_name=args[1]
    kernel=args[2]
    split=float(args[3])
    dataset=pd.read_csv(dataset_name)
    x=dataset.iloc[:,:-1]
    y=dataset.iloc[:,-1].values
    x_train,x_test,y_train,y_test=train_test_split(x,y,test_size=split)
    clasifier=SVC(kernel=kernel)
    clasifier.fit(x_train,y_train)
    s=dump(clasifier,"SVM_"+kernel+"_"+str(split))
    with open("train.csv","wb") as f:
        pickle.dump([x_train , y_train], f)
    with open("test.csv","wb") as f:
        pickle.dump([x_test,y_test], f)