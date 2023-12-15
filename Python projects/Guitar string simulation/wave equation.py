import numpy as np
import matplotlib.pyplot as plt
import numba
import scienceplots
from matplotlib.animation import FuncAnimation


nx, nt = 100, 1000
xmax, tmax = 1, 2
dx = xmax / (nx - 1)
dt = tmax / (nt - 1)
c = 1
s = c * dt ** 2 / dx ** 2
print(s)

u = np.zeros((nx, nt))
x_ar = np.linspace(0, xmax, nx)
t_ar = np.linspace(0, tmax, nt)
u[:, 0] = np.sin(np.pi * x_ar) # initial condition
u[:, 1] = np.sin(np.pi * x_ar) * (1 + dt) # initial speed

@numba.jit("f8[:, :](f8[:, :], i8, i8, f8)", nopython=True, nogil=True)
def compute_sol(u, nx, nt, s):
    for t in range(1, nt - 1):
        for x in range(1, nx - 1):
            u[x, t + 1] = s * (u[x - 1, t] - 2 * u[x, t] + u[x + 1, t]) + 2 * u[x, t] - u[x, t - 1]
    return u

u = compute_sol(u, nx, nt, s)

X, T = np.meshgrid(x_ar, t_ar)

fig = plt.figure()
ax = fig.add_subplot(1, 2, 1, projection="3d")
surf = ax.plot_surface(X, T, u.T, cmap='viridis')
ax.set_xlabel("X")
ax.set_ylabel("Time")
ax.set_zlabel("Amplitude")
ax.set_title(r"Numerical solution to the wave equation with initial condition $u(x, 0) = u_t(x, 0) = sin(\pi x)$")
fig.colorbar(surf, shrink=0.5, aspect=10)

ax = fig.add_subplot(1, 2, 2, projection='3d')
sol = np.sin(np.pi * X) * (np.cos(np.pi * T) + np.sin(np.pi * T) / np.pi)

surf = ax.plot_surface(X, T, sol, cmap='viridis')
ax.set_xlabel("X")
ax.set_ylabel("Time")
ax.set_zlabel("Amplitude")
ax.set_title(r"Analytical solution to the wave equation with initial condition $u(x, 0) = u_t(x, 0) = sin(\pi x)$")
fig.colorbar(surf, shrink=0.5, aspect=10)

# make an animation
plt.style.use(["science", "ieee", "grid", "no-latex"])
fig, ax = plt.subplots(figsize=(4, 2.5))
line, = ax.plot(x_ar, u[:, 0])
time_text = ax.text(0.02, 0.94, '', transform=ax.transAxes, bbox=dict(facecolor='white', edgecolor='black', boxstyle='round,pad=0.5'), fontsize=5)
ax.set_title(r"Guitar string with initial condition $u(x, 0) = u_t(x, 0) = sin(\pi x)$", fontsize=7)

def update(frame):
    current_time = frame * dt
    time_text.set_text(f"Time: {current_time:.2f}")
    line.set_ydata(u[:, 10 * frame])
    return line, time_text

frame_rate = 60
frame_interval = 1000 / frame_rate

animation = FuncAnimation(fig, update, frames=range(nt // 10), blit=True, interval=frame_interval)
ax.set_ylim(-1.5, 1.5)
ax.set_xlim(0, xmax)
ax.set_xlabel("X", fontsize=5)
ax.set_ylabel("Amplitude", fontsize=5)
plt.tight_layout(rect=(0, 0, 0.9, 1))

plt.show()
