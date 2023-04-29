from sklearn.neighbors import KNeighborsClassifier
import pandas as pd
import numpy as np
from PIL import Image
import os
import openpyxl


class Model:
    def __init__(self):
        self.data_file_path = r"C:\Users\aatus\PycharmProjects\pythonProject\projects\Python_projects\projects\Machine " \
                    r"learning digit recognition software\input_data.xlsx"
        self.data = pd.read_excel(self.data_file_path)
        self.x_data = self.data[self.data.columns[:-1]].values
        self.y_data = self.data[self.data.columns[-1]].values
        self.knn_model = KNeighborsClassifier(n_neighbors=1)
        self.knn_model.fit(self.x_data, self.y_data)

    def train(self):
        directory = r"C:\Users\aatus\PycharmProjects\pythonProject\projects\Python_projects\projects\Machine " \
                    r"learning digit recognition software\data"
        file_path = self.data_file_path
        workbook = openpyxl.load_workbook(file_path)
        sheet = workbook.active
        for filename in os.listdir(directory):
            file = os.path.join(directory, filename)
            image = Image.open(file)
            pixels = image.load()
            picture_array = []
            for y in range(32):
                for x in range(32):
                    r, g, b, a = pixels[x, y]
                    picture_array.append(int(a / 255))
            picture_array.append(filename[0])
            sheet.append(picture_array)
            workbook.save(file_path)
            self.data = pd.read_excel(file_path)
            self.x_data = self.data.iloc[:, :1024]
            self.y_data = self.data.iloc[:, 1024:]
            self.knn_model.fit(self.x_data, self.y_data)

    def predict(self, picture):
        pixels = picture.load()
        picture_array = []
        for y in range(32):
            for x in range(32):
                r, g, b, a = pixels[x, y]
                picture_array.append(int(a / 255))
        predict_x = np.array(picture_array).reshape(1, -1)
        number = self.knn_model.predict(predict_x).item()
        return number
