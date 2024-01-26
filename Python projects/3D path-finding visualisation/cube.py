import helper as h
import numpy as np
import pygame
from random import random

class cell:
	def __init__(self, x, y, z, cell_size, i, j, k):
		# indeces in 3d-array
		self.i = i
		self.j = j
		self.k = k

		# coordinates of center and corners
		self.offset = round(cell_size / 2 - 6)
		self.cell_size = cell_size
		self.coordinates = [[x, y, z],
		[x - self.offset, y - self.offset, z - self.offset],
		[x - self.offset, y - self.offset, z + self.offset],
		[x - self.offset, y + self.offset, z - self.offset],
		[x - self.offset, y + self.offset, z + self.offset],
		[x + self.offset, y - self.offset, z - self.offset],
		[x + self.offset, y - self.offset, z + self.offset],
		[x + self.offset, y + self.offset, z - self.offset],
		[x + self.offset, y + self.offset, z + self.offset]]
		self.corners = np.array(self.coordinates).T
		self.shift = np.array([2 * h.SCREEN_WIDTH / 5, h.SCREEN_HEIGHT / 2])

		# wall
		self.is_wall = random() < h.probability_of_wall

		# pathfinding A*
		self.is_start = False
		self.is_end = False
		self.f = 0
		self.g = 0
		self.h = 0
		self.came_from = None

	def __lt__(self, another):
		return self.f < another.f
	
	def rotate(self, matrix):
		self.corners = np.dot(matrix, self.corners)

	def convert_wall(self):
		self.is_wall = not self.is_wall
		self.show_wall = self.is_wall

	def draw_cell(self, screen, color):
		for point_1 in self.corners.T[1:]:
			for point_2 in self.corners.T[1:]:
				if np.linalg.norm(point_2 - point_1) <= self.cell_size and np.linalg.norm(point_2 - point_1, ord=1) > 0:
					start = point_1[0:3:2] + self.shift
					end = point_2[0:3:2] + self.shift
					pygame.draw.line(screen, color, start.tolist(), end.tolist())

	def draw_center(self, screen):
		pygame.draw.circle(screen, h.colors[1], (self.corners.T[0][0:3:2] + self.shift).tolist(), 5)
