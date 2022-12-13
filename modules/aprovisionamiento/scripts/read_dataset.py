import pandas as pd
import matplotlib.pyplot as plt
import sys

base='/root/scripts/'

if __name__ == '__main__':
    args = sys.argv
    print(args)
    dataset_in = sys.argv[1]
    dataset_out = sys.argv[2]

    full_path = base + dataset_in 

    #This must be replaced by a querys to a cache database respectvely
    dataset = pd.read_csv(full_path)
    dataset.to_csv(base+dataset_out)

    #print(dataset.corr())
    # dataplot=sns.heatmap(dataset.corr(),cmap="YlGnBu",annot=True)
    # plt.show() #guardar_archivo y shiny