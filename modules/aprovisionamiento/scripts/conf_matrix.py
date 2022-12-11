import sys
import pandas as pd
from sklearn.svm import SVC
from sklearn.model_selection import train_test_split
from joblib import load
import pickle
from sklearn.model_selection import cross_val_score
from sklearn.metrics import confusion_matrix

if __name__ == '__main__':
    args=sys.argv
    clasifier_name=args[1]
    train=args[2]
    test=args[3]
    clasifier=load(clasifier_name)
    with open(train,"rb") as f:
        x_train,y_train=pickle.load(f)
    with open(test,"rb") as f:
        x_test,y_test=pickle.load(f)

    y_pred=clasifier.predict(x_test)
    cm=confusion_matrix(y_test,y_pred)
    print(cm)
