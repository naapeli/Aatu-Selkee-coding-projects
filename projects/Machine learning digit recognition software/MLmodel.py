from sklearn.neighbors import KNeighborsClassifier
import numpy as np
from PIL import Image
import os


class Model:
    def __init__(self, number_of_each_digit=100):
        self.number_of_each_digit = number_of_each_digit
        self.x_data = np.zeros((1, 1024))
        self.y_data = np.zeros((1, 1))
        self.knn_model = KNeighborsClassifier(n_neighbors=2)
        self.train()

    def train(self):
        directory = r"C:\Users\aatus\PycharmProjects\Python_projects\projects\Machine " \
                    r"learning digit recognition software\data\train"
        for digit_name in os.listdir(directory):
            i = 0
            for filename in os.listdir(os.path.join(directory, digit_name)):
                i += 1
                print(digit_name, i)
                if i <= self.number_of_each_digit:
                    file = os.path.join(directory, digit_name, filename)
                    image = Image.open(file)
                    pixels = np.asarray(image)
                    pixels = pixels.reshape(1, 1024)
                    self.x_data = np.vstack([self.x_data, pixels])
                    self.y_data = np.vstack([self.y_data, digit_name])
        self.knn_model.fit(self.x_data[1:, :], np.ravel(self.y_data[1:, :]))

    def predict(self, picture):
        predict_x = np.asarray(picture)[:, :, 1] / 255
        predict_x = predict_x.reshape(1, 1024)
        number = self.knn_model.predict(predict_x).item()
        return number
