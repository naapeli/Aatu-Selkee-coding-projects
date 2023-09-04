import pygame
import os

BASE_PATH = os.getcwd() + r"/scripts/pictures/"

def load_picture(path, scale=(32, 32)):
	full_path = BASE_PATH + path
	picture = pygame.transform.scale(pygame.image.load(full_path).convert(), scale)
	picture.set_colorkey((0, 0, 0))
	return picture

def load_pictures(folder_path, scale=(32, 32)):
	pictures = []
	full_path = BASE_PATH + folder_path
	for filename in os.listdir(full_path):
		path = os.path.join(folder_path, filename)
		pictures.append(load_picture(path, scale))
	return pictures


class animation:
	def __init__(self, images, image_duration=5, loop=True):
		self.images = images
		self.image_duration = image_duration
		self.loop = loop
		self.done = False
		self.frame = 0

	def copy(self):
		return animation(self.images, self.image_duration, self.loop)

	def current_image(self):
		return self.images[self.frame // self.image_duration]

	def update(self):
		if self.loop:
			self.frame = (self.frame + 1) % (self.image_duration * len(self.images))
		else:
			self.frame = min(self.frame + 1, self.image_duration * len(self.images) - 1)
			if self.frame >= self.image_duration * len(self.images) - 1:
				self.done = True

