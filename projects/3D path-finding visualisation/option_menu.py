import helper as h
import tkinter as tk

class optionMenu:
	def __init__(self):
		# preset used
		self.preset_used = False

		self.root = tk.Tk()
		self.root.title("Options")
		window = tk.Frame(self.root)
		window.pack(padx=10, pady=10)

		options_label = tk.Label(window, font=('Arial', 30), text="Options")
		options_label.grid(row=0, column=0, pady=5)

		# drawing options
		drawing_options_labelframe = tk.LabelFrame(window)
		drawing_options_labelframe.grid(row=1, column=0, pady=5)

		drawing_options_label = tk.Label(drawing_options_labelframe, font=('Arial', 22), text="Drawing options")
		drawing_options_label.grid(row=0, column=0, pady=5)

		drawing_options = tk.LabelFrame(drawing_options_labelframe)
		drawing_options.grid(row=1, column=0)

		# draw path
		draw_path_grid = tk.LabelFrame(drawing_options)
		draw_path_grid.grid(row=1, column=0)
		draw_path_label = tk.Label(draw_path_grid, font=('Arial', 12), text="Draw path")
		draw_path_label.grid(row=0, column=0)
		self.draw_path_value = tk.StringVar(self.root)
		self.draw_path_value.set(str(h.draws_path))
		self.draw_path_option = tk.OptionMenu(draw_path_grid, self.draw_path_value, *["False", "True"])
		self.draw_path_option.grid(row=1, column=0)

		# draw closed set
		draw_closed_grid = tk.LabelFrame(drawing_options)
		draw_closed_grid.grid(row=1, column=1)
		draw_closed_label = tk.Label(draw_closed_grid, font=('Arial', 12), text="Draw closed set")
		draw_closed_label.grid(row=0, column=0)
		self.draw_closed_value = tk.StringVar(self.root)
		self.draw_closed_value.set(str(h.draw_closed))
		self.draw_closed_option = tk.OptionMenu(draw_closed_grid, self.draw_closed_value, *["False", "True"])
		self.draw_closed_option.grid(row=1, column=0)

		# draw open set
		draw_open_grid = tk.LabelFrame(drawing_options)
		draw_open_grid.grid(row=1, column=2)
		draw_open_label = tk.Label(draw_open_grid, font=('Arial', 12), text="Draw open set")
		draw_open_label.grid(row=0, column=0)
		self.draw_open_value = tk.StringVar(self.root)
		self.draw_open_value.set(str(h.draw_open))
		self.draw_open_option = tk.OptionMenu(draw_open_grid, self.draw_open_value, *["False", "True"])
		self.draw_open_option.grid(row=1, column=0)

		# grid options
		grid_options_labelframe = tk.LabelFrame(window)
		grid_options_labelframe.grid(row=2, column=0, pady=5)

		grid_options_label = tk.Label(grid_options_labelframe, font=('Arial', 22), text="Grid options")
		grid_options_label.grid(row=0, column=0, pady=5)

		grid_options = tk.LabelFrame(grid_options_labelframe)
		grid_options.grid(row=1, column=0)

		# rows
		rows_grid = tk.LabelFrame(grid_options)
		rows_grid.grid(row=1, column=0)
		rows_label = tk.Label(rows_grid, font=('Arial', 12), text="Rows:")
		rows_label.grid(row=0, column=0)
		self.rows_option = tk.Scale(rows_grid, from_=2, to_=15)
		self.rows_option.set(h.rows)
		self.rows_option.grid(row=0, column=1)

		# columns
		columns_grid = tk.LabelFrame(grid_options)
		columns_grid.grid(row=1, column=1)
		columns_label = tk.Label(columns_grid, font=('Arial', 12), text="Columns:")
		columns_label.grid(row=0, column=0)
		self.columns_option = tk.Scale(columns_grid, from_=2, to_=15)
		self.columns_option.set(h.columns)
		self.columns_option.grid(row=0, column=1)

		# height
		height_grid = tk.LabelFrame(grid_options)
		height_grid.grid(row=1, column=2)
		height_label = tk.Label(height_grid, font=('Arial', 12), text="Height:")
		height_label.grid(row=0, column=0)
		self.height_option = tk.Scale(height_grid, from_=1, to_=10)
		self.height_option.set(h.depth)
		self.height_option.grid(row=0, column=1)

		# wall options
		wall_options_labelframe = tk.LabelFrame(window)
		wall_options_labelframe.grid(row=3, column=0, pady=5)

		wall_options_label = tk.Label(wall_options_labelframe, font=('Arial', 22), text="Wall options")
		wall_options_label.grid(row=0, column=0, pady=5)

		wall_options = tk.LabelFrame(wall_options_labelframe)
		wall_options.grid(row=1, column=0)

		# wall probability
		wall_probability_grid = tk.LabelFrame(wall_options)
		wall_probability_grid.grid(row=0, column=0)
		wall_probability_label = tk.Label(wall_probability_grid, font=('Arial', 12), text="Probability of wall")
		wall_probability_label.grid(row=0, column=0)
		self.wall_probability_option = tk.Scale(wall_probability_grid, from_=0, to_=1, resolution=0.01, orient="horizontal")
		self.wall_probability_option.set(h.probability_of_wall)
		self.wall_probability_option.grid(row=1, column=0)

		# preset walls
		wall_preset_grid = tk.LabelFrame(wall_options)
		wall_preset_grid.grid(row=0, column=1)
		wall_preset_label = tk.Label(wall_preset_grid, font=('Arial', 12), text="Wall presets")
		wall_preset_label.grid(row=0, column=0)
		preset_1 = tk.Button(wall_preset_grid, text="Preset 1", font=('Arial', 12), command=self.wall_preset_1)
		preset_1.grid(row=1, column=0)
		preset_2 = tk.Button(wall_preset_grid, text="Preset 2", font=('Arial', 12), command=self.wall_preset_2)
		preset_2.grid(row=2, column=0)

		# save options
		save_button = tk.Button(window, text="Save options", font=('Arial', 18), command=self.save_options)
		save_button.grid(row=4, column=0)

		window.mainloop()

	def wall_preset_1(self):
		for i in range(1, h.rows + 1):
			for j in range(1, h.columns + 1):
				for k in range(1, h.depth + 1):
					cube = h.cubes[i][j][k]
					if not cube.is_start or not cube.is_end:
						cube.is_wall = (i == round(h.rows/2))
					cube.is_start = False
					cube.is_end = False
		h.cubes[round((h.rows)/2)][round((h.columns)/2)][round((h.depth + 1)/2)].is_wall = False
		h.cubes[1][1][1].is_wall = False
		h.cubes[1][1][1].is_start = True
		h.cubes[h.rows][h.columns][h.depth].is_wall = False
		h.cubes[h.rows][h.columns][h.depth].is_end = True
		self.preset_used = True

	def wall_preset_2(self):
		for i in range(1, h.rows + 1):
			for j in range(1, h.columns + 1):
				for k in range(1, h.depth + 1):
					cube = h.cubes[i][j][k]
					if not cube.is_start and not cube.is_end:
						cube.is_wall = (i % 2 == 1 and j % 2 == 1 and k % 2 == 1)
		self.preset_used = True

	def save_options(self):
		h.draw_open = (self.draw_open_value.get() == "True")
		h.draw_closed = (self.draw_closed_value.get() == "True")
		h.draws_path = (self.draw_path_value.get() == "True")
		h.probability_of_wall = self.wall_probability_option.get()
		if not self.preset_used and self.dimensions_changed():
			h.rows = self.rows_option.get()
			h.columns = self.columns_option.get()
			h.depth = self.height_option.get()
			if h.depth != 1:
				h.layer = h.depth + 1
			else:
				h.layer = 1
			h.cubes = [[[0 for k in range(h.depth + 2)] for j in range(h.columns + 2)] for i in range(h.rows + 2)]
			h.create_cubes()
		elif self.dimensions_changed():
			tk.messagebox.showwarning(title="Warning!", message="Preset used. Change the dimensions of the grid again.")
		self.root.destroy()

	def dimensions_changed(self):
		return h.rows != self.rows_option.get() or h.columns != self.columns_option.get() or h.depth != self.height_option.get()