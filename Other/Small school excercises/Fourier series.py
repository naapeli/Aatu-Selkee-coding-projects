import numpy as np
import matplotlib.pyplot as plt


x = np.linspace(-5, 5, 150)

def f(x):
	return x ** 2

def fourier(x):
	value = 0
	for k in range(-3, 3):
		if k != 0:
			value += (2 * (-1) ** k) / (k ** 2) * np.cos(k * x)
		else:
			value += 1 / (2 * np.pi) * (((np.pi) ** 3) / 3 - ((-np.pi) ** 3) / 3) * np.cos(k * x)
	return value

plt.plot(x, f(x), label="f(x)")
plt.plot(x, fourier(x), label="fourier series of f(x) with 6 terms")
plt.legend()
plt.show()