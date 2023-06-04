import helper as h
import numpy as np
from tkinter import messagebox
import time
import pygame
import UI


def run(screen, rows, columns, depth, clock, draw_open, draw_closed, draw_path):
	open_set = []
	closed_set = []
	start = None
	end = None

	for i in range(1, rows + 1):
		for j in range(1, columns + 1):
			for k in range(1, depth + 1):
				cube = h.cubes[i][j][k]
				cube.f = 0
				cube.g = 0
				cube.h = 0
				cube.came_from = None
				if cube.is_start:
					start = cube
				if cube.is_end:
					end = cube

	open_set.append(start)

	while len(open_set) > 0:
		if start == None or end == None:
			messagebox.showwarning(title="Warning", message="Remember to set starting- and endingpoints!")
			return []
		# find lowest f in open set
		current = open_set[0]
		for cell in open_set:
			if cell.f < current.f:
				current = cell

		# check if we have found the end
		if current.is_end:
			path = []
			temp = current
			while temp is not None:
				path.append(temp)
				temp = temp.came_from
			return path

		# transfer current from open_set to closed_set
		open_set.remove(current)
		closed_set.append(current)

		# add neighbours of current to open_set (if not in closed_set)
		neighbours = h.get_neighbours(current)
		for neighbour in neighbours:
			if neighbour not in closed_set:
				potential_g = current.g + 1
				if neighbour in open_set:
					if potential_g < neighbour.g:
						neighbour.g = potential_g
						neighbour.came_from = current
				else:
					neighbour.g = potential_g
					open_set.append(neighbour)
					neighbour.came_from = current
				# l1 norm between point indeces used as the heuristic
				# neighbour.h = np.linalg.norm(neighbour.corners.T[0] - end.corners.T[0], ord=1) / h.scale
				neighbour.h = abs(neighbour.i - end.i) + abs(neighbour.j - end.j) + abs(neighbour.k - end.k)
				neighbour.f = neighbour.g + neighbour.h

		# drawing
		if draw_open or draw_closed or draw_path:
			screen.fill((255, 255, 255))
			UI.draw_ui(screen, clock)
			if h.layer <= 0 or h.layer >= h.depth + 1:
				h.draw_all(screen)
			else:
				h.draw_layer(screen)

		# drawing open and closed sets
		if draw_open:
			for cell in open_set:
				if not cell.is_end and not cell.is_start:
					cell.draw_cell(screen, h.colors[3])
		if draw_closed:
			for cell in closed_set:
				if not cell.is_end and not cell.is_start:
					cell.draw_cell(screen, h.colors[2])

		# drawing path
		if draw_path:
			path = []
			temp = current
			while temp is not None:
				path.append(temp)
				temp = temp.came_from
			h.path = path
			for cell in path:
				cell.draw_cell(screen, h.colors[6])

		if draw_open or draw_closed or draw_path:
			clock.tick()
			pygame.display.update()

	messagebox.showwarning(title="Warning", message="No solution exists!")
	return []
