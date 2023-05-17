import numpy as np
import matplotlib.pyplot as plt


A = np.array([[2, 1, 0], [1, 2, 1], [0, 1, 2]])
eigenvalues, eigenvectors = np.linalg.eig(A)
largest_eigenvalue = max(max(eigenvalues), abs(min(eigenvalues)))
x0 = np.array([1, 0, 0]).T

xi = x0
mu = (xi.T@A@xi)/(xi.T@xi)

for i in range(11):
    plt.plot(i, largest_eigenvalue-mu, marker='.', color='blue')
    xi = (A@xi)/(np.linalg.norm(A@xi))
    mu = (xi.T @ A @ xi) / (xi.T @ xi)
    print(mu)

plt.title('error of the algorithm')
plt.gca().set_xlabel('iteration')
plt.gca().set_ylabel('error')
plt.grid()
plt.axis('tight')
plt.show()
