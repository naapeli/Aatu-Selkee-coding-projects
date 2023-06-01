import pygame
from sys import exit
import numpy as np

screen = pygame.display.set_mode((800, 800))
clock = pygame.time.Clock()
t = 0

def vector_field(t, i, j):
	vector = np.array([np.cos(t)*np.tan(i), np.sin(t)*j**2])
	return 10 * vector / np.linalg.norm(vector)

while True:
	for event in pygame.event.get():
		if event.type == pygame.QUIT:
			pygame.quit()
			exit()

	screen.fill((255, 255, 255))

	grid = [[vector_field(t, i, j) for i in range(80)] for j in range(80)]

	for i in range(80):
		for j in range(80):
			start = np.array([10*i, 10*j])
			end = start + grid[i][j]

			pygame.draw.line(screen, (0, 0, 0), start, end)

	t += 0.01

	clock.tick(60)

	pygame.display.update()
