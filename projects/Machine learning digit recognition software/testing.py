from PIL import Image
import numpy as np
import tkinter as tk

# load the image
image = Image.open(r'C:\Users\aatus\PycharmProjects\Python_projects\projects\Machine learning digit recognition software\data\Train\0\0.jpg')
# convert image to numpy array
data = np.asarray(image)
data = data.reshape((1, 1024))


kuva = np.zeros((5, 1024))
kuva = np.vstack([kuva, data])
x = Image.open(r'C:\Users\aatus\PycharmProjects\Python_projects\projects\Machine learning digit recognition software\data\Train\0\0.jpg')
y = np.asarray(image)
print(y.shape)
# Image.fromarray(data).save(r'C:\Users\aatus\PycharmProjects\pythonProject\projects\Python_projects\projects\Machine '
#                            r'learning digit recognition software\ykköskuva.jpg')

