import helper as h
import numpy as np
from tkinter import messagebox
from queue import PriorityQueue
from math import inf
import pygame
import UI


def run(screen, rows, columns, depth, clock, draw_open, draw_closed, draw_path):
	open_set = PriorityQueue()
	in_open_set = set()
	closed_set = set()
	start = None
	end = None

	for i in range(1, rows + 1):
		for j in range(1, columns + 1):
			for k in range(1, depth + 1):
				cube = h.cubes[i][j][k]
				cube.f = inf
				cube.came_from = None
				if cube.is_start:
					start = cube
				if cube.is_end:
					end = cube

	if start == None or end == None:
		messagebox.showwarning(title="Warning", message="Remember to set starting- and endingpoints!")
		return []
	start.f = 0
	open_set.put(start)
	in_open_set.add(start)

	while not open_set.empty():
		if start == None or end == None:
			messagebox.showwarning(title="Warning", message="Remember to set starting- and endingpoints!")
			return []
		# find lowest f in open set
		# transfer current from open_set to closed_set
		current = open_set.get()
		in_open_set.remove(current)
		closed_set.add(current)

		# check if we have found the end
		if current.is_end:
			path = []
			temp = current
			while temp is not None:
				path.append(temp)
				temp = temp.came_from
			return path

		# add neighbours of current to open_set (if not in closed_set)
		neighbours = h.get_neighbours(current)
		potential_f = current.f + 1
		for neighbour in neighbours:
			if potential_f < neighbour.f:
				neighbour.f = potential_f
				neighbour.came_from = current
				if neighbour not in in_open_set:
					in_open_set.add(neighbour)
					open_set.put(neighbour)

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
			for cell in in_open_set:
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
