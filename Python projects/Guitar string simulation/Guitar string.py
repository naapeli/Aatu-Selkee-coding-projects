import numpy as np
import matplotlib.pyplot as plt
import scienceplots
from matplotlib.animation import FuncAnimation
import numba
import os

from scipy.io import wavfile

def save_note(frequency, note):
    nx, nt = 101, 500000
    xmax, tmax = 0.7, 2.5
    dx = xmax / (nx - 1)
    dt = tmax / (nt - 1)
    f = frequency
    c = 2 * xmax * f
    gamma = 2.6 * 10 ** (-5)
    l = 2 * 10 ** (-6)
    s = (1/(c ** 2* dt ** 2) + gamma / (2 * dt)) ** (-1)
    print(s)

    u = np.zeros((nx, nt))
    x_ar = np.linspace(0, xmax, nx)
    t_ar = np.linspace(0, tmax, nt)
    y0 = np.concatenate([np.linspace(0, 0.01, 70), np.linspace(0.01, 0, 31)]) # initial condition

    u[:, 0] = y0
    u[:, 1] = y0 # initial speed 0

    @numba.jit("f8[:, :](f8[:, :], i8, i8, f8, f8, f8, f8, f8)", nopython=True, nogil=True)
    def compute_sol(u, nx, nt, dx, dt, c, gamma, l):
        for t in range(1, nt - 1):
            for x in range(2, nx - 2):
                term1 = 1 / dx ** 2 * (u[x - 1, t] - 2 * u[x, t] + u[x + 1, t])
                term2 = 1 / (c ** 2 * dt ** 2) * (u[x, t - 1] - 2 * u[x, t])
                term3 = gamma / (2 * dt) * u[x, t - 1]
                term4 = l ** 2 / dx ** 4 * (u[x + 2, t] - 4 * u[x + 1, t] + 6 * u[x, t] - 4 * u[x - 1, t] + u[x - 2, t])
                u[x, t + 1] = s * (term1 - term2 + term3 - term4)
        return u

    sol = compute_sol(u, nx, nt, dx, dt, c, gamma, l)
    u = sol[:, ::10]

    # make an animation
    plt.style.use(["science", "ieee", "grid", "no-latex"])
    fig, ax = plt.subplots(figsize=(4, 1.5))
    line, = ax.plot(x_ar, u[:, 0])
    time_text = ax.text(0.02, 0.88, '', transform=ax.transAxes, bbox=dict(facecolor='white', edgecolor='black', boxstyle='round,pad=0.5'), fontsize=5)
    ax.set_title("Guitar string vibrating", fontsize=7)

    def update(frame):
        current_time = 10 * frame * dt
        time_text.set_text(f"Time: {current_time:.2f}")
        line.set_ydata(u[:, frame])
        return line, time_text

    frame_rate = 20
    frame_interval = 1000 / frame_rate

    animation = FuncAnimation(fig, update, frames=1000, blit=True, interval=frame_interval)
    ax.set_xlim(0, xmax)
    ax.set_ylim(-0.01, 0.01)
    ax.set_xlabel("X", fontsize=5)
    ax.set_ylabel("Amplitude", fontsize=5)
    plt.tight_layout(rect=(0, 0, 0.9, 1))

    #plt.show()

    # determine harmonics using fourier analysis
    def get_harmonic(n):
        sin_ar = np.sin(n * np.pi * x_ar)
        return np.array([sum(sin_ar * x_row) for x_row in sol.T])

    harmonics = [get_harmonic(n) for n in range(1, 15)]
    total_harmonics = sum(harmonics)[::10]

    wavfile.write(note, 20000, total_harmonics.astype(np.float32))

filepath = os.path.join(os.getcwd(), "Python projects", "Guitar string simulation", "Videos and audio files", "notes", "A2.wav")
save_note(110.00, filepath)
