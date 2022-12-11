import pandas as pd
import seaborn as sns
import matplotlib.pyplot as plt
import sys
if __name__ == '__main__':
    args = sys.argv
    dataset_name = sys.argv[1]
    dataset = pd.read_csv(dataset_name)
    #print(dataset.corr())
    dataplot=sns.heatmap(dataset.corr(),cmap="YlGnBu",annot=True)
    plt.show() #guardar_archivo y shiny