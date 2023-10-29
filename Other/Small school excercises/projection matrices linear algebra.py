import numpy as np

V = np.array([[1, 1], [2, 1], [1, 2], [0, 1]])
W = np.array([[2, 1], [1, 1], [1, 1], [0, 1]])


Q = V@np.linalg.inv(V.T@V)@V.T
P = np.block([V, np.zeros((4, 2))])@np.linalg.inv(np.block([V, W]))

print(np.allclose(Q@Q, Q))
print(np.allclose(P@P, P))
print(np.allclose(Q.T@(np.identity(4) - Q), np.zeros((4, 4))))
print(np.allclose(P@V, V))
print(np.allclose(P@W, np.zeros((4, 2))))
