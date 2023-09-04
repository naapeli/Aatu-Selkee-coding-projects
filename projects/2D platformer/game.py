import pygame
from scripts.controls import detect_event
from scripts.entities import physics_entity
from scripts.utilities import load_picture, load_pictures, animation
from scripts.tilemap import tilemap


class game:
	def __init__(self):
		self.SCREEN_WIDTH = 1440
		self.SCREEN_HEIGHT = 810
		self.screen = pygame.display.set_mode((self.SCREEN_WIDTH, self.SCREEN_HEIGHT))
		pygame.display.set_caption('2D platformer')
		self.display = pygame.Surface((1280, 640))
		self.clock = pygame.time.Clock()

		self.assets = {
		"background": pygame.Rect(0, 0, self.SCREEN_WIDTH, self.SCREEN_HEIGHT),
		"grass": load_pictures("grass/"),
		"dirt": load_pictures("dirt/"),
		"stone": load_pictures("stone/"),
		"player": {
		"idle": animation(load_pictures("player/idle/", scale=(32,64)), image_duration=6),
		"jump": animation(load_pictures("player/jump/", scale=(32,64)), image_duration=6),
		"run": animation(load_pictures("player/run/", scale=(32,64)))
		}
		}

		self.tilemap = tilemap(self.assets)
		for j in range(2, 9):
			self.tilemap.add_tile(str(j) + ";5", "stone", 0, (j, 5), 0)
		for i in range(0, 9):
			self.tilemap.add_tile(str(i) + ";7", "grass", 0, (i, 7), 0)
		self.tilemap.add_tile("9;7", "grass", 1, (9, 7), 0)
		self.tilemap.add_tile("9;8", "grass", 0, (9, 8), 3)
		self.tilemap.add_tile("9;9", "grass", 2, (9, 9), 0)
		for i in range(10, 15):
			self.tilemap.add_tile(str(i) + ";9", "grass", 0, (i, 9), 0)
		for i in range(0, 9):
			self.tilemap.add_tile(str(i) + ";8", "dirt", 0, (i, 8), 0)


		self.player = physics_entity(self.assets["player"])

		self.camera_offset = [self.player.get_rect().centerx, self.player.get_rect().centery]

	def run(self):
		self.camera_offset[0] += (self.player.get_rect().centerx - self.display.get_width() / 2 - self.camera_offset[0]) / 20
		self.camera_offset[1] += (self.player.get_rect().centery - self.display.get_height() / 2 - self.camera_offset[1]) / 20
		render_camera_offset = [int(self.camera_offset[0]), int(self.camera_offset[1])]

		self.display.fill((100, 100, 255))

		detect_event(self.player)

		self.tilemap.render(self.display, offset=render_camera_offset)

		self.player.update(self.tilemap.get_collision_tiles(self.player.position))
		self.player.render(self.display, offset=render_camera_offset)

		self.screen.blit(pygame.transform.scale(self.display, self.screen.get_size()), (0, 0))
		self.clock.tick(60)
		pygame.display.update()

if "__main__" == __name__:
	game = game()

	while True:
		game.run()
