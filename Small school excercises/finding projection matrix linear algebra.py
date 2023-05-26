import numpy as np

a = np.array([1, 1, 1]).T
b = np.array([1, -2, 1]).T
c = np.cross(a, b)
ccT = np.dot(c.reshape(3, 1), c.reshape(1, 3))
aaT = np.dot(a.reshape(3, 1), a.reshape(1, 3))
bbT = np.dot(b.reshape(3, 1), b.reshape(1, 3))

print(np.allclose(ccT / np.linalg.norm(c)**2, np.identity(3) - (aaT / np.linalg.norm(a)**2 + bbT / np.linalg.norm(b)**2)))
