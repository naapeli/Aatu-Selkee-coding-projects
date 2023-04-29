import tkinter as tk
import numpy as np
import pandas as pd
import MLmodel
from PIL import Image, ImageTk


# constants
width_height = 32


class GUI:
    def __init__(self, master):
        self.window = master
        self.window.title("Digit recognition software")
        self.canvas = tk.Canvas(self.window, width=width_height, height=width_height, highlightthickness=1,
                                highlightbackground="black")
        self.canvas.grid(row=0, column=0)
        self.canvas.bind("<B1-Motion>", self.paint)
        self.image = tk.PhotoImage(width=width_height, height=width_height)
        self.canvas.create_image((width_height / 2, width_height / 2), image=self.image, state="normal")
        frame = tk.Frame(self.window)
        frame.grid(row=1, column=0)
        clear_button = tk.Button(frame, command=self.clear_canvas, text="Clear canvas", width=22)
        clear_button.grid(row=0, column=0)
        determine_number_button = tk.Button(frame, command=self.determine_number, text="Determine number", width=22)
        determine_number_button.grid(row=0, column=1, padx=2)
        save_image_button = tk.Button(frame, command=self.save_image, text="Save image", width=22)
        save_image_button.grid(row=0, column=2)
        file_name_label = tk.Label(frame, text="Picture filename")
        file_name_label.grid(row=2, column=0)
        self.file_name_entry = tk.Entry(self.window, width=66)
        self.file_name_entry.grid(row=3, column=0)
        self.result_label = tk.Label(self.window, text="-")
        self.result_label.grid(row=4, column=0)

    def paint(self, event):
        x, y = max(min(event.x, width_height - 1), 1), max(min(event.y, width_height - 1), 1)
        self.image.put("#000000", (x, y))

    def clear_canvas(self):
        self.canvas.destroy()
        self.canvas = tk.Canvas(self.window, width=width_height, height=width_height, highlightthickness=1,
                                highlightbackground="black")
        self.image = tk.PhotoImage(width=width_height, height=width_height)
        self.canvas.create_image((width_height / 2, width_height / 2), image=self.image, state="normal")
        self.canvas.bind("<B1-Motion>", self.paint)
        self.canvas.grid(row=0, column=0)

    def determine_number(self):
        image = ImageTk.getimage(self.image)
        self.clear_canvas()
        model = MLmodel.Model()
        number = model.predict(image)
        self.result_label = tk.Label(self.window, text=str(number))
        self.result_label.grid(row=4, column=0)

    def save_image(self):
        image = self.image
        file_name = self.file_name_entry.get()
        image.write(file_name + ".jpg", format="jpg")
        self.clear_canvas()


if __name__ == '__main__':
    root = tk.Tk()
    GUI = GUI(root)
    root.mainloop()
