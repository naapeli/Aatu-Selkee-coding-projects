from sklearn.neighbors import KNeighborsClassifier
import numpy as np
from PIL import Image
import os


class Model:
    def __init__(self):
        self.x_data = np.zeros((1, 1024))
        self.y_data = np.zeros((1, 1))
        self.knn_model = KNeighborsClassifier(n_neighbors=1)
        self.train()

    def train(self):
        directory = r"C:\Users\aatus\PycharmProjects\Python_projects\projects\Machine " \
                    r"learning digit recognition software\data"
        for filename in os.listdir(directory):
            file = os.path.join(directory, filename)
            image = Image.open(file)
            pixels = np.asarray(image)[:, :, 3]
            pixels = pixels.reshape(1, 1024) / 255
            self.x_data = np.vstack([self.x_data, pixels])
            self.y_data = np.vstack([self.y_data, int(filename[0])])
        self.knn_model.fit(self.x_data[1:, :], np.ravel(self.y_data[1:, :]))

    def predict(self, picture):
        predict_x = np.asarray(picture)[:, :, 3]
        predict_x = predict_x.reshape(1, 1024) / 255
        number = self.knn_model.predict(predict_x).item()
        return number


malli = Model()
