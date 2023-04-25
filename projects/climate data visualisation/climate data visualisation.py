import tkinter as tk
import math


months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November",
          "December"]
one_radius = 300
zero_radius = 150
width = 800
height = width


def create_circle(x, y, r, canvas):
    x0 = x - r
    y0 = x - r
    x1 = x + r
    y1 = x + r
    canvas.create_oval(x0, y0, x1, y1, width=1, outline="white")


class ClimateVisualisation:
    def __init__(self, master):
        master.title("Climate data")
        self.window = tk.Frame(master, bg="gray20")
        self.window.pack()
        label = tk.Label(self.window, text="Temperature each mont from 1888 to 2023", font=('Arial', 22), bg="gray20",
                         fg="white")
        label.pack(pady=10)
        self.canvas = tk.Canvas(self.window, width=width, height=height, bg="gray20")
        create_circle(width/2, height/2, one_radius, self.canvas)
        create_circle(width/2, height/2, zero_radius, self.canvas)
        self.canvas.pack()
        for i, month in enumerate(months):
            angle = 2 * math.pi * i / len(months) - math.pi / 2
            degrees = - angle * 180 / math.pi - 90
            r = one_radius + (height - 2 * one_radius) / 4
            x = r * math.cos(angle) + width / 2
            y = r * math.sin(angle) + height / 2
            self.canvas.create_text(x, y, angle=degrees, text=month, fill="white", font=('Arial', 16), anchor="center")
        self.canvas.pack()

    def run(self):
        1


root = tk.Tk()
ClimateVisualisation(root)
root.mainloop()
