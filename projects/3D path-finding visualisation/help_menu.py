import tkinter as tk


grid_opt_text = "Use 'TOGGLE WALLS' button to toggle walls by pressing on the black dots. Note that a member of the grid can be converted if only 1 layer is visible. Switch the position of start and end by pressing the 'SELECT ___'\nbutton and selecting the positon using the black dot. Use the 'RANDOMIZE WALLS' button to select new set of walls randomly from the grid. Walls can be hidden / shown using the 'HIDE / SHOW WALLS' button\nand the pathcan be hidden by pressing the 'HIDE PATH' button."
run_alg_text = "Run different path-finding algorithms using the 'RUN ___' buttons. Dijkstra's algorithm is an algorithm for finding the shortest paths between nodes in a weighted graph, which may represent, for example, road networks.\nCompared to Dijkstra's algorithm, the A* algorithm only finds the shortest path from a specified source to a specified goal, and not the shortest-path tree from a specified source to all possible goals.\nThis is a necessary trade-off for using a specific-goal-directed heuristic. For Dijkstra's algorithm, since the entire shortest-path tree is generated, every node is a goal, and there can be no specific-goal-directed heuristic."
draw_opt_text = "In the 'DRAWING OPTIONS' menu, select if you want the program to draw the path (drawn in purple), the closet set (already determined members, drawn in red) and the open set (members in consideration, drawn in green).\nNote that drawing any of the three options will affect the performance considerably. In the 'GRID OPTIONS' menu, select the dimensions of the grid using the sliders. In the 'WALL OPTIONS' menu, select the\nprobability of a member of the grid being a wall. Presets can also be used to show differences between the algorithms. Note that changes into the dimensions of the grid will not be applied if a preset is used."
ctrls_text = "Use the 'ARROW KEYS' to rotate the picture. Loop through the layers in the picture using 'COMMA' and 'PERIOD'."

class helpMenu:
	def __init__(self):
		self.root = tk.Tk()
		self.root.title("Help")
		window = tk.Frame(self.root)
		window.pack(padx=10, pady=10)

		help_label = tk.Label(window, font=('Arial', 30), text="Help")
		help_label.grid(row=0, column=0, pady=5)


		grid_options_labelframe = tk.LabelFrame(window)
		grid_options_labelframe.grid(row=1, column=0, pady=5)

		grid_options_label = tk.Label(grid_options_labelframe, font=('Arial', 22), text="Grid options", width=90)
		grid_options_label.grid(row=0, column=0, pady=5)

		grid_options_text = tk.Label(grid_options_labelframe, font=('Arial', 12), text=grid_opt_text)
		grid_options_text.grid(row=1, column=0, pady=5)


		run_algorithms_labelframe = tk.LabelFrame(window)
		run_algorithms_labelframe.grid(row=2, column=0, pady=5)

		run_algorithms_label = tk.Label(run_algorithms_labelframe, font=('Arial', 22), text="Run algorithms", width=90)
		run_algorithms_label.grid(row=0, column=0, pady=5)

		run_algorithms_text = tk.Label(run_algorithms_labelframe, font=('Arial', 12), text=run_alg_text)
		run_algorithms_text.grid(row=1, column=0, pady=5)


		draw_options_labelframe = tk.LabelFrame(window)
		draw_options_labelframe.grid(row=3, column=0, pady=5)

		draw_options_label = tk.Label(draw_options_labelframe, font=('Arial', 22), text="Draw options", width=90)
		draw_options_label.grid(row=0, column=0, pady=5)

		draw_options_text = tk.Label(draw_options_labelframe, font=('Arial', 12), text=draw_opt_text)
		draw_options_text.grid(row=1, column=0, pady=5)


		controls_labelframe = tk.LabelFrame(window)
		controls_labelframe.grid(row=4, column=0, pady=5)

		controls_label = tk.Label(controls_labelframe, font=('Arial', 22), text="Controls", width=90)
		controls_label.grid(row=0, column=0, pady=5)

		controls_text = tk.Label(controls_labelframe, font=('Arial', 12), text=ctrls_text)
		controls_text.grid(row=1, column=0, pady=5)


		done_button = tk.Button(window, text="Ok, got it!", font=('Arial', 18), command=self.done)
		done_button.grid(row=5, column=0)



		window.mainloop()

	def done(self):
		self.root.destroy()
