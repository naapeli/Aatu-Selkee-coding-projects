import numpy as np

def my_gsmith(A):
	dimensions = np.shape(A)
	Q = np.zeros(dimensions)
	R = np.zeros((dimensions[1], dimensions[1]))

	for i in range(dimensions[1]):
		q = A[:, i]

		for j in range(np.shape(Q)[1]):
			R[j, i] = q.T@Q[:, j]
			q = q - R[j, i]*Q[:, j]

		R[i, i] = np.linalg.norm(q)
		Q[:, i] = q / R[i, i]

	return Q, R

A = np.array([[1, 2, 2],
	[1, 1, 2],
	[2, 1, 1],
	[2, 2, 1]])

Q, R = my_gsmith(A)
print(Q)
print("--------------------------------------")
print(R)
