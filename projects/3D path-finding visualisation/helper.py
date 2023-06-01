import numpy as np
import pygame
from sys import exit
from math import floor
from cube import cell
from random import random
import a_star_algorithm as a_star
import dijkstras_algorithm as dijkstras

pygame.init()
pygame.font.init()

# UI
UI_FONT = pygame.font.SysFont("Timesnewroman", 25)
button_1 = None
button_2 = None
button_3 = None
button_4 = None
button_5 = None
button_6 = None
button_7 = None
button_8 = None

# Constants
SCREEN_HEIGHT = 800
SCREEN_WIDTH = 1200
height = 300
square = 600
scale = 50
rows = round(square / scale)
columns = round(square / scale)
depth = round(height / scale)
colors = [(255, 255, 255), (0, 0, 0), (255, 0, 0), (0, 255, 0), (255, 255, 0), (0, 0, 255), (169, 62, 232)]

# Variables
angle_x = 0
angle_z = 0
layer = depth + 1
cubes = [[[0 for k in range(depth + 2)] for j in range(columns + 2)] for i in range(rows + 2)]
path = []
show_centers = False
select_start = False
select_end = False

# create cell objects in 3d grid
for i in range(rows + 2):
	for j in range(columns + 2):
		for k in range(depth + 2):
			x = (i - floor((rows + 2) / 2)) * scale
			y = (j - floor((columns + 2) / 2)) * scale
			z = (k - floor((depth + 2) / 2)) * scale
			cubes[i][j][k] = cell(x, y, z, scale, i, j, k)
			if i == 0 or i == rows + 1 or j == 0 or j == columns + 1 or k == 0 or k == depth + 1:
				cubes[i][j][k].is_wall = True
				cubes[i][j][k].show_wall = False

def ROTATE_X(angle_x):
	return np.array([
	[1, 0, 0],
	[0, np.cos(angle_x), -np.sin(angle_x)],
	[0, np.sin(angle_x), np.cos(angle_x)]
])

def ROTATE_Z(angle_z): 
	return np.array([
	[np.cos(angle_z), -np.sin(angle_z), 0],
	[np.sin(angle_z), np.cos(angle_z), 0],
	[0, 0, 1]
])

def detect_event(screen):
	global angle_z, angle_x, angle_y, layer, depth, show_centers, select_start
	global select_end, path
	for event in pygame.event.get():
		if event.type == pygame.QUIT:
			pygame.quit()
			exit()
		if event.type == pygame.KEYDOWN:
			if event.key == pygame.K_LEFT:
				angle_z = 0.1
			if event.key == pygame.K_RIGHT:
				angle_z = -0.1
			if event.key == pygame.K_UP:
				angle_x = 0.1
			if event.key == pygame.K_DOWN:
				angle_x = -0.1
			if event.key == pygame.K_COMMA:
				layer = min(layer + 1, depth + 1)
			if event.key == pygame.K_PERIOD:
				layer = max(layer - 1, 1)
		if event.type == pygame.KEYUP:
			if event.key == pygame.K_LEFT:
				angle_z = 0
			if event.key == pygame.K_RIGHT:
				angle_z = 0
			if event.key == pygame.K_UP:
				angle_x = 0
			if event.key == pygame.K_DOWN:
				angle_x = 0
		if event.type == pygame.MOUSEBUTTONDOWN:
			mouse_pos = np.array(event.pos)
			# if user clicks on a black square, when only 1 layer is visible, converts wall.
			if layer > -1 and layer < depth + 1 and show_centers:
				for i in range(1, rows + 1):
					for j in range(1, columns + 1):
						cube = cubes[i][j][layer]
						center = cube.corners.T[0][0:3:2] + cube.shift
						if np.linalg.norm(center - mouse_pos) < 5:
							if select_start:
								cube.is_wall = False
								cube.show_wall = False
								cube.is_start = True
								select_start = False
							elif select_end:
								cube.is_wall = False
								cube.show_wall = False
								cube.is_end = True
								select_end = False
							elif not cube.is_start and not cube.is_end:
								cube.convert_wall()
			# if user presses convert walls-button
			if button_1.collidepoint(mouse_pos):
				show_centers = not show_centers
			if button_2.collidepoint(mouse_pos):
				for i in range(1, rows + 1):
					for j in range(1, columns + 1):
						for k in range(1, depth + 1):
							cubes[i][j][k].is_start = False
				select_start = True
				show_centers = True
			if button_3.collidepoint(mouse_pos):
				for i in range(1, rows + 1):
					for j in range(1, columns + 1):
						for k in range(1, depth + 1):
							cubes[i][j][k].is_end = False
				select_end = True
				show_centers = True
			if button_4.collidepoint(mouse_pos):
				path = []
				for i in range(1, rows + 1):
					for j in range(1, columns + 1):
						for k in range(1, depth + 1):
							if not cubes[i][j][k].is_start and not cubes[i][j][k].is_end:
								cubes[i][j][k].is_wall = random() > 0.8
								cubes[i][j][k].show_wall = cubes[i][j][k].is_wall
			if button_5.collidepoint(mouse_pos):
				path = a_star.run(screen, rows, columns, depth)
			if button_6.collidepoint(mouse_pos):
				for i in range(1, rows + 1):
					for j in range(1, columns + 1):
						for k in range(1, depth + 1):
							cubes[i][j][k].show_wall = not cubes[i][j][k].show_wall
			if button_7.collidepoint(mouse_pos):
				path = []
			if button_8.collidepoint(mouse_pos):
				path = dijkstras.run(screen, rows, columns, depth)

				

def draw_all(screen):
	for i in range(rows + 2):
		for j in range(columns + 2):
			for k in range(depth + 2):
				cubes[i][j][k].rotate(ROTATE_X(angle_x))
				cubes[i][j][k].rotate(ROTATE_Z(angle_z))
				if i != 0 and i != rows + 1 and j != 0 and j != columns + 1 and k != 0 and k != depth + 1:
					cubes[i][j][k].draw_cell(screen, show_centers, get_color(cubes[i][j][k]))

def draw_layer(screen):
	for i in range(rows + 2):
		for j in range(columns + 2):
			for k in range(depth + 2):
				cubes[i][j][k].rotate(ROTATE_X(angle_x))
				cubes[i][j][k].rotate(ROTATE_Z(angle_z))
				if i != 0 and i != rows + 1 and j != 0 and j != columns + 1 and k == layer:
					cubes[i][j][layer].draw_cell(screen, show_centers, get_color(cubes[i][j][layer]))

def draw_path(screen):
	for cell in path:
		cell.is_path = True
		cell.draw_cell(screen, show_centers, colors[6])
		cell.is_path = False

def get_color(cube):
		if cube.is_wall:
			return colors[1]
		if cube.is_start:
			return colors[4]
		if cube.is_end:
			return colors[5]
		else:
			return colors[0]

# gets neighbours in 3x3x3 grid around a cell
# def get_neighbours(cell):
# 	neighbours = [[[-1 for z in range(3)] for y in range(3)] for x in range(3)]
# 	i = cell.i
# 	j = cell.j
# 	k = cell.k
# 	for x in range(3):
# 		for y in range(3):
# 			for z in range(3):
# 				if not cell.is_wall and (x == 1 and y == 1 and z == 1):
# 					neighbours[x][y][z] = cubes[i + (x - 1)][j + (y - 1)][k + (z - 1)]
# 	return neighbours

def get_neighbours(cell):
	i = cell.i
	j = cell.j
	k = cell.k
	neighbours = []
	if not cubes[i + 1][j][k].is_wall: neighbours.append(cubes[i + 1][j][k])
	if not cubes[i - 1][j][k].is_wall: neighbours.append(cubes[i - 1][j][k])
	if not cubes[i][j + 1][k].is_wall: neighbours.append(cubes[i][j + 1][k])
	if not cubes[i][j - 1][k].is_wall: neighbours.append(cubes[i][j - 1][k])
	if not cubes[i][j][k + 1].is_wall: neighbours.append(cubes[i][j][k + 1])
	if not cubes[i][j][k - 1].is_wall: neighbours.append(cubes[i][j][k - 1])
	return neighbours
