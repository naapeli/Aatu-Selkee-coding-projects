import pygame
from scripts.controls import detect_event
from scripts.entities import player
from scripts.utilities import load_picture, load_pictures
from scripts.tilemap import tilemap


class game:
	def __init__(self):
		self.SCREEN_WIDTH = 1280
		self.SCREEN_HEIGHT = 960
		self.screen = pygame.display.set_mode((self.SCREEN_WIDTH, self.SCREEN_HEIGHT))
		pygame.display.set_caption('2D platformer')
		self.display = pygame.Surface((480, 360))
		self.clock = pygame.time.Clock()

		self.assets = {
		"background": pygame.Rect(0, 0, self.SCREEN_WIDTH, self.SCREEN_HEIGHT),
		"player": load_picture("player/01.png"),
		"grass": load_pictures("grass/"),
		"dirt": load_pictures("dirt/"),
		"stone": load_pictures("stone/")
		}

		self.tilemap = tilemap(self.assets)
		for j in range(2, 9):
			self.tilemap.add_tile(str(j) + ";5", "stone", 0, (j, 5), 0)
		for i in range(0, 9):
			self.tilemap.add_tile(str(i) + ";7", "grass", 0, (i, 7), 0)
		self.tilemap.add_tile("9;7", "grass", 1, (9, 7), 0)
		self.tilemap.add_tile("9;8", "grass", 0, (9, 8), 3)
		for i in range(0, 9):
			self.tilemap.add_tile(str(i) + ";8", "dirt", 0, (i, 8), 0)


		self.player = player(self.assets["player"])

	def run(self):
		self.display.fill((100, 100, 255))

		detect_event(self.player)

		self.tilemap.render(self.display)

		self.player.update(self.tilemap.get_collision_tiles(self.player.position))
		self.player.render(self.display)

		self.screen.blit(pygame.transform.scale(self.display, self.screen.get_size()), (0, 0))
		self.clock.tick(60)
		pygame.display.update()

if "__main__" == __name__:
	game = game()

	while True:
		game.run()
