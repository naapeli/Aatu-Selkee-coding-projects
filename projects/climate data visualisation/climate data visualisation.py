import tkinter as tk


class ClimateVisualisation:
    def __init__(self, master):
        master.title("Climate data")
        self.window = tk.Frame(master)


root = tk.Tk()
ClimateVisualisation(root)
root.mainloop()
