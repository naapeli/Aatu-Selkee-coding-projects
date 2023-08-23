import pygame
import os

BASE_PATH = os.getcwd() + r"/scripts/pictures/"

def load_picture(path):
	full_path = BASE_PATH + path
	picture = pygame.image.load(full_path).convert()
	picture.set_colorkey((0, 0, 0))
	return picture

def load_pictures(folder_path):
	pictures = []
	full_path = BASE_PATH + folder_path
	for filename in os.listdir(full_path):
		path = os.path.join(folder_path, filename)
		pictures.append(load_picture(path))
	return pictures
