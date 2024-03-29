import numpy as np
import pygame
from sys import exit
from math import floor
from cube import cell
from random import random
import wa_star_algorithm as wa_star
import dijkstras_algorithm as dijkstras
from option_menu import optionMenu
from help_menu import helpMenu

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
button_9 = None
button_10 = None

# Constants
SCREEN_HEIGHT = 800
SCREEN_WIDTH = 1200
scale = 50
colors = [(255, 255, 255), (0, 0, 0), (255, 0, 0), (0, 255, 0), (255, 255, 0), (0, 0, 255), (169, 62, 232)]
w_constant = 2

# Variables
angle_x = 0
angle_z = 0
rows = 15
columns = 15
depth = 1
layer = None
if depth != 1:
	layer = depth + 1
else:
	layer = 1
cubes = [[[0 for k in range(depth + 2)] for j in range(columns + 2)] for i in range(rows + 2)]
path = []
show_centers = False
select_start = False
select_end = False
show_walls = True
draw_open = True
draw_closed = True
draws_path = True
probability_of_wall = 0.2

def create_cubes():
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

	# setting default start and end
	cubes[round((rows)/2)][round((columns)/2)][round((depth + 1)/2)].is_wall = False
	cubes[round((rows)/2)][round((columns)/2)][round((depth + 1)/2)].is_start = True
	cubes[rows][columns][depth].is_wall = False
	cubes[rows][columns][depth].is_end = True

create_cubes()

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

def detect_event(screen, clock):
	global angle_z, angle_x, angle_y, layer, depth, show_centers, select_start
	global select_end, path, show_walls
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
				if depth == 1:
					layer = 1
			if event.key == pygame.K_PERIOD:
				layer = max(layer - 1, 1)
				if depth == 1:
					layer = 1
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
			# if user clicks on a black dot, converts wall.
			if (layer > -1 and layer < depth + 1 and show_centers):
				for i in range(1, rows + 1):
					for j in range(1, columns + 1):
						cube = cubes[i][j][layer]
						center = cube.corners.T[0][0:3:2] + cube.shift
						if np.linalg.norm(center - mouse_pos) < 5:
							if select_start:
								cube.is_wall = False
								cube.is_start = True
								select_start = False
							elif select_end:
								cube.is_wall = False
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
								cubes[i][j][k].is_wall = random() < probability_of_wall
			if button_5.collidepoint(mouse_pos):
				path = wa_star.run(screen, rows, columns, depth, clock, draw_open, draw_closed, draws_path, w_constant)
			if button_6.collidepoint(mouse_pos):
				show_walls = not show_walls
			if button_7.collidepoint(mouse_pos):
				path = []
			if button_8.collidepoint(mouse_pos):
				path = dijkstras.run(screen, rows, columns, depth, clock, draw_open, draw_closed, draws_path)
			if button_9.collidepoint(mouse_pos):
				path = []
				optionMenu()
			if button_10.collidepoint(mouse_pos):
				helpMenu()


def draw_all(screen):
	for i in range(rows + 2):
		for j in range(columns + 2):
			for k in range(depth + 2):
				cubes[i][j][k].rotate(ROTATE_X(angle_x))
				cubes[i][j][k].rotate(ROTATE_Z(angle_z))
				if i != 0 and i != rows + 1 and j != 0 and j != columns + 1 and k != 0 and k != depth + 1:
					if (cubes[i][j][k].is_wall and show_walls) or cubes[i][j][k].is_end or cubes[i][j][k].is_start:
						cubes[i][j][k].draw_cell(screen, get_color(cubes[i][j][k]))
					if show_centers:
						cubes[i][j][k].draw_center(screen)

def draw_layer(screen):
	for i in range(rows + 2):
		for j in range(columns + 2):
			for k in range(depth + 2):
				cubes[i][j][k].rotate(ROTATE_X(angle_x))
				cubes[i][j][k].rotate(ROTATE_Z(angle_z))
				if i != 0 and i != rows + 1 and j != 0 and j != columns + 1 and k == layer:
					if (cubes[i][j][layer].is_wall and show_walls) or cubes[i][j][layer].is_end or cubes[i][j][layer].is_start:
						cubes[i][j][layer].draw_cell(screen, get_color(cubes[i][j][layer]))
					if show_centers:
						cubes[i][j][layer].draw_center(screen)


def draw_path(screen):
	for cell in path:
		cell.draw_cell(screen, colors[6])

def get_color(cube):
	if cube.is_wall:
		return colors[1]
	if cube.is_start:
			return colors[4]
	if cube.is_end:
		return colors[5]
	else:
		return colors[0]

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
