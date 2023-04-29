from PIL import Image
from numpy import asarray
import numpy as np
# load the image
image = Image.open(r'C:\Users\aatus\PycharmProjects\pythonProject\projects\Python_projects\projects\Machine '
                   r'learning digit recognition software\nollakuva.jpg')
# convert image to numpy array
data = asarray(image)

kuva = np.zeros((32, 32))
for i in range(32):
    kuva[i][16] = 1

Image.fromarray(data).save(r'C:\Users\aatus\PycharmProjects\pythonProject\projects\Python_projects\projects\Machine '
                           r'learning digit recognition software\ykköskuva.jpg')

