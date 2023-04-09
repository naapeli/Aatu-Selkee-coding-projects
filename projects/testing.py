import tkinter as tk
from tkinter import ttk
import random
import math


def set_up():
    for x_coord in line_x_coords:
        canvas.create_line(x_coord, 0, x_coord, window_height, fill=intersecting_color)
        canvas.pack()


def intersects(x1: float, x2: float) -> bool:
    for x_coord in line_x_coords:
        if x1 <= x_coord <= x2 or x1 >= x_coord >= x2:
            return True
    return False


def create_line():
    global inter, total
    x_coord = random.uniform(0, window_width)
    y_coord = random.uniform(0, window_height)
    angle = random.uniform(0, 2 * math.pi)
    x_diff = math.cos(angle) * length / 2
    y_diff = math.sin(angle) * length / 2
    x1 = x_coord - x_diff
    x2 = x_coord + x_diff
    y1 = y_coord - y_diff
    y2 = y_coord + y_diff
    if intersects(x1, x2):
        canvas.create_line(x1, y1, x2, y2, fill=intersecting_color)
        inter += 1
        total += 1
    else:
        canvas.create_line(x1, y1, x2, y2, fill=line_color)
        total += 1


def update_texts():
    label_4['text'] = f"{inter}/{total}"
    if inter != 0:
        label_5['text'] = f"{round(2 * length / strip * (total / inter), 15)}"
    else:
        label_5['text'] = ""
    if inter != 0:
        label_6['text'] = f"{round(2 * length * total / (strip * inter), 2)}"
    else:
        label_6['text'] = ""


def run():
    if running:
        create_line()
        update_texts()
        window.after(update_time, run)


def run_stop():
    global running, button_index
    button_index += 1
    run_button.configure(text=button_text[button_index % 2], activebackground=button_color[button_index % 2])
    running = not running
    run()


def clear_all():
    global inter, total
    canvas.delete("all")
    inter = 0
    total = 0
    update_texts()
    set_up()


def update():
    global length, strip, update_time, line_x_coords, line_color, bg_color, intersecting_color
    length = int(length_entry.get())
    strip = int(strip_entry.get())
    update_time = int(update_time_entry.get())
    line_x_coords = range(0, window_width + 1, strip)
    canvas["bg"] = bg_color_drop_down.get()
    line_color = line_color_drop_down.get()
    intersecting_color = intersecting_color_drop_down.get()
    clear_all()


def reset_to_default():
    global length, strip, update_time, line_x_coords, line_color, bg_color, intersecting_color
    length = default_length
    strip = default_strip
    update_time = default_update_time
    line_x_coords = range(0, window_width + 1, strip)
    canvas["bg"] = default_bg_color
    line_color = default_line_color
    intersecting_color = default_intersecting_color
    clear_all()


# constants
default_bg_color = "black"
default_line_color = "white"
default_intersecting_color = "green"
default_length = 50
default_strip = 100
default_update_time = 1
window_width = 1600
window_height = 750
button_color = ("PaleGreen3", "brown1")
button_text = ("Run", "Stop")
# variables
length = 50
strip = 100
line_x_coords = range(0, window_width + 1, strip)
update_time = 1
running = False
button_index = 0
bg_color = default_bg_color
line_color = default_line_color
intersecting_color = default_intersecting_color
# results
inter = 0
total = 0

# window
root = tk.Tk()
root.title("Buffon's needle problem")
window = tk.Frame(root)
window.pack()
# canvas
canvas_frame = tk.LabelFrame(window)
canvas_frame.pack()
canvas = tk.Canvas(canvas_frame, height=window_height, width=window_width, bg=bg_color)
canvas.grid(row=0, column=0)
# below frames
below_frame = tk.LabelFrame(window)
below_frame.pack()
# buttons
left_below_frame = tk.LabelFrame(below_frame)
left_below_frame.grid(row=0, column=0, padx=5, pady=5)
run_button = tk.Button(left_below_frame, text="Run", height=1, width=10, font=('Arial', 22), command=run_stop,
                       activebackground="PaleGreen3")
run_button.grid(row=0, column=0)
clear_all_button = tk.Button(left_below_frame, text="Clear all", height=1, width=10, font=('Arial', 22),
                             command=clear_all)
clear_all_button.grid(row=1, column=0)
update_button = tk.Button(left_below_frame, text="Update", height=1, width=10, font=('Arial', 22), command=update)
update_button.grid(row=2, column=0)
# info texts
middle_below_frame = tk.LabelFrame(below_frame)
middle_below_frame.grid(row=0, column=1)
label_1 = tk.Label(middle_below_frame, font=('Arial', 22), text="intersecting / total = ")
label_1.grid(row=0, column=0)
label_2 = tk.Label(middle_below_frame, font=('Arial', 22), text="Pi = ")
label_2.grid(row=1, column=0)
label_3 = tk.Label(middle_below_frame, font=('Arial', 22), text="Pi ≈ ")
label_3.grid(row=2, column=0)
label_4 = tk.Label(middle_below_frame, font=('Arial', 22), text="0/0", width=20)
label_4.grid_propagate(False)
label_4.grid(row=0, column=1)
label_5 = tk.Label(middle_below_frame, font=('Arial', 22), text="", width=20)
label_5.grid_propagate(False)
label_5.grid(row=1, column=1)
label_6 = tk.Label(middle_below_frame, font=('Arial', 22), text="")
label_6.grid(row=2, column=1)
# settings
right_below_frame = tk.LabelFrame(below_frame)
right_below_frame.grid(row=0, column=2)
label_7 = tk.Label(right_below_frame, font=('Arial', 22), text="strip")
label_7.grid(row=0, column=0)
label_8 = tk.Label(right_below_frame, font=('Arial', 22), text="length")
label_8.grid(row=1, column=0)
label_9 = tk.Label(right_below_frame, font=('Arial', 22), text="simulation speed")
label_9.grid(row=2, column=0)
default_strip_var = tk.StringVar(value=f"{default_strip}")
strip_entry = tk.Spinbox(right_below_frame, from_=10, to=200, textvariable=default_strip_var, width=5)
strip_entry.grid(row=0, column=1)
default_length_var = tk.StringVar(value=f"{default_length}")
length_entry = tk.Spinbox(right_below_frame, from_=5, to=100, textvariable=default_length_var, width=5)
length_entry.grid(row=1, column=1)
default_update_time_var = tk.StringVar(value=f"{default_update_time}")
update_time_entry = tk.Spinbox(right_below_frame, from_=1, to=20, textvariable=default_update_time_var, width=5)
update_time_entry.grid(row=2, column=1)
# reset to default
right_right_below_frame = tk.LabelFrame(below_frame)
right_right_below_frame.grid(row=0, column=4)
reset_to_default_button = tk.Button(right_right_below_frame, text="Reset\nto\ndefault", height=4, width=7,
                                    font=('Arial', 18), command=reset_to_default)
reset_to_default_button.grid(row=0, column=0)
# color settings
right_right_right_below_frame = tk.LabelFrame(below_frame)
right_right_right_below_frame.grid(row=0, column=3)
bg_color_label = tk.Label(right_right_right_below_frame, text="Background color", font=('Arial', 22))
bg_color_label.grid(row=0, column=0)
bg_color_drop_down = ttk.Combobox(right_right_right_below_frame, values=['white', 'black'], state='readonly', width=7)
bg_color_drop_down.set(bg_color)
bg_color_drop_down.grid(row=0, column=1)
line_color_label = tk.Label(right_right_right_below_frame, text="Line color", font=('Arial', 22))
line_color_label.grid(row=1, column=0)
line_color_drop_down = ttk.Combobox(right_right_right_below_frame,
                                    values=['white', 'black', 'blue', 'red', 'yellow', 'green'],
                                    state='readonly', width=7)
line_color_drop_down.set(line_color)
line_color_drop_down.grid(row=1, column=1)
intersecting_color_label = tk.Label(right_right_right_below_frame, text="Intersecting line color", font=('Arial', 22))
intersecting_color_label.grid(row=2, column=0, padx=5)
intersecting_color_drop_down = ttk.Combobox(right_right_right_below_frame,
                                            values=['white', 'black', 'blue', 'red', 'yellow', 'green'],
                                            state='readonly', width=7)
intersecting_color_drop_down.set(intersecting_color)
intersecting_color_drop_down.grid(row=2, column=1)


set_up()
window.mainloop()
