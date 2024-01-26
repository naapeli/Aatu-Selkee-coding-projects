import helper as h
import numpy as np
from tkinter import messagebox
from queue import PriorityQueue
import pygame
import UI


def run(screen, rows, columns, depth, clock, draw_open, draw_closed, draw_path):
	open_set = PriorityQueue()
	in_open_set = set()
	closed_set = set()
	start = None
	end = None

	def peek():
		return open_set.queue[0]

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

	open_set.put(start)
	in_open_set.add(start)

	while not open_set.empty():
		if start == None or end == None:
			messagebox.showwarning(title="Warning", message="Remember to set starting- and endingpoints!")
			return []
		# find lowest g in open set
		current = peek()

		# check if we have found the end
		if current.is_end:
			path = []
			temp = current
			while temp is not None:
				path.append(temp)
				temp = temp.came_from
			return path

		# transfer current from open_set to closed_set
		open_set.get()
		in_open_set.remove(current)
		closed_set.add(current)

		# add neighbours of current to open_set (if not in closed_set)
		neighbours = h.get_neighbours(current)
		for neighbour in neighbours:
			if neighbour not in closed_set:
				potential_f = current.f + 1
				if neighbour in in_open_set:
					if potential_f < neighbour.f:
						neighbour.f = potential_f
						neighbour.came_from = current
				else:
					neighbour.f = potential_f
					open_set.put(neighbour)
					in_open_set.add(neighbour)
					neighbour.came_from = current

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
