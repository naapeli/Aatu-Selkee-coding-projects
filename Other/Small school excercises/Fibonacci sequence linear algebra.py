import numpy as np
F1 = 1
F2 = 1

x2 = np.array([F1, F2]).T
A = np.array([[1, 1], [1, 0]])

U, D, _ = np.linalg.svd(A)
D = np.diag(D)


def fibonacci(n):
    xn = U@(D**(n-2))@U.T@x2
    return xn[0]


print(fibonacci(10), fibonacci(20), fibonacci(30))
# returns 55.000000000000014 6765.0000000000055 832040.0000000008
