import tensorflow as tf
import pandas as pd
import numpy as np
from PIL import Image
import os
import openpyxl
import matplotlib.pyplot as plt


class Model:
    def __init__(self):
        self.data_file_path = r"C:\Users\aatus\PycharmProjects\pythonProject\projects\Python_projects\projects\Machine " \
                    r"learning digit recognition software\input_data.xlsx"
        self.data = pd.read_excel(self.data_file_path)
        self.data = pd.read_excel(self.data_file_path)
        self.x_data = self.data[self.data.columns[:-1]].values
        self.y_data = self.data[self.data.columns[-1]].values
        self.validation_data = pd.read_excel(r"C:\Users\aatus\PycharmProjects\pythonProject\projects\Python_projects\projects\Machine learning digit recognition software\validation_data.xlsx")
        self.x_validation_data = self.validation_data[self.validation_data.columns[:-1]].values
        self.y_validation_data = self.validation_data[self.validation_data.columns[-1]].values
        self.nn_model = tf.keras.Sequential([
            tf.keras.layers.Dense(32, activation='relu', input_shape=(1024,)),
            tf.keras.layers.Dense(32, activation='relu'),
            tf.keras.layers.Dense(1, activation='sigmoid')
        ])
        self.nn_model.compile(optimizer=tf.keras.optimizers.Adam(0.001), loss='binary_crossentropy', metrics=['accuracy'])

    def save_validation_data(self):
        directory = r"C:\Users\aatus\PycharmProjects\pythonProject\projects\Python_projects\projects\Machine " \
                    r"learning digit recognition software\validation data"
        file_path = r"C:\Users\aatus\PycharmProjects\pythonProject\projects\Python_projects\projects\Machine " \
                    r"learning digit recognition software\validation_data.xlsx"
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
            self.x_data = self.data[self.data.columns[:-1]].values
            self.y_data = self.data[self.data.columns[-1]].values

    def save_training_data(self):
        directory = r"C:\Users\aatus\PycharmProjects\pythonProject\projects\Python_projects\projects\Machine learning digit recognition software\data"
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
            self.x_data = self.data[self.data.columns[:-1]].values
            self.y_data = self.data[self.data.columns[-1]].values

    def train(self):
        history = self.nn_model.fit(self.x_data, self.y_data, epochs=1000, batch_size=100,
                                    validation_data=(self.x_validation_data, self.y_validation_data), verbose=0)

        def plot_loss(history):
            plt.plot(history.history['loss'], label='loss')
            plt.plot(history.history['val_loss'], label='val_loss')
            plt.xlabel('Epoch')
            plt.ylabel('Binary crossentropy')
            plt.legend()
            plt.grid(True)
            plt.show()

        def plot_accuracy(history):
            plt.plot(history.history['accuracy'], label='accuracy')
            plt.plot(history.history['val_accuracy'], label='val_accuracy')
            plt.xlabel('Epoch')
            plt.ylabel('Accuracy')
            plt.legend()
            plt.grid(True)
            plt.show()

        plt.figure(1)
        plot_loss(history)
        plt.figure(2)
        plot_accuracy(history)

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


malli = Model()
malli.train()
