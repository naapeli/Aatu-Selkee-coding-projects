import pygame
import sys


def detect_event(player):
	for event in pygame.event.get():
		if event.type == pygame.QUIT:
			pygame.quit()
			sys.exit()
		if event.type == pygame.KEYDOWN:
			if event.key == pygame.K_LEFT:
				player.movement[0] = True
			if event.key == pygame.K_RIGHT:
				player.movement[1] = True
			if event.key == pygame.K_SPACE:
				if player.jump_counter > 0:
					player.jump_counter -= 1
					player.velocity[1] = -player.jump_strength
		if event.type == pygame.KEYUP:
			if event.key == pygame.K_LEFT:
				player.movement[0] = False
			if event.key == pygame.K_RIGHT:
				player.movement[1] = False
