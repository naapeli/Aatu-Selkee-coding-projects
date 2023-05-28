import helper as h
import UI
import pygame

screen = pygame.display.set_mode((h.SCREEN_WIDTH, h.SCREEN_HEIGHT))
pygame.display.set_caption('path-finding visualisation')
clock = pygame.time.Clock()


while True:
	screen.fill((255, 255, 255))

	UI.draw_ui(screen)
	
	if h.layer <= 0 or h.layer >= h.depth + 1:
		h.draw_all(screen)
	else:
		h.draw_layer(screen)

	if len(h.path) > 0:
		h.draw_path(screen)

	h.detect_event(screen)

	clock.tick(60)
	pygame.display.update()
