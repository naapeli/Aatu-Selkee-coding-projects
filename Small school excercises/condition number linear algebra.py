import numpy as np
import matplotlib.pyplot as plt


epsilon = np.linspace(10**-4, 1, 1000)
for e in epsilon:
	V = np.array([[1, 1], [0, e]])
	k = np.linalg.cond(V)
	plt.semilogy(e, k, marker=".", color="blue")


plt.title("Condition number for V")
plt.xlabel("epsilon")
plt.ylabel("Condition number")
plt.grid("true")
plt.show()

print(np.linalg.eig(np.array([[1, 1], [0, 1]]))[0])
print(np.linalg.eig(np.array([[1, 1], [0, 1]]))[1])
print(np.linalg.cond(np.array([[1, 1], [0, 0]])))
