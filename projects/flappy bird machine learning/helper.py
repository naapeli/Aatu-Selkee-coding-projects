import pygame
from game import *
from sys import exit

pygame.init()
pygame.font.init()
SCREEN_WIDTH = 400
SCREEN_HEIGHT = 600
screen = pygame.display.set_mode((SCREEN_WIDTH, SCREEN_HEIGHT))
BIRD_IMG = pygame.transform.scale(pygame.image.load(r"pictures\bird.png").convert_alpha(), (150, 150))
PIPE_IMG_BOTTOM = pygame.image.load(r"pictures\pipe.png").convert_alpha()
PIPE_IMG_TOP = pygame.transform.flip(PIPE_IMG_BOTTOM, False, True).convert_alpha()
BG_SIZE = 600
GAP = 200
PIPE_VEL = 2.5
FONT = pygame.font.SysFont("Timesnewroman", 50)

generation = 0

def draw_window(win, birds, pipes, bg, score, generation):
	win.blit(bg, (0, 0))
	for bird in birds:
		bird.draw(win)
	for pipe in pipes:
		pipe.draw(win)
	score_text = FONT.render("Score: " + str(score), 1, (255, 255, 255))
	win.blit(score_text, (10, 10))
	generation_text = FONT.render("Generation: " + str(generation), 1, (255, 255, 255))
	win.blit(generation_text, (10, 50))
	pygame.display.update()

def detect_event(birds):
	for event in pygame.event.get():
			if event.type == pygame.QUIT:
				pygame.quit()
				exit()

			#if event.type == pygame.KEYDOWN:
				#for bird in birds:
					#bird.jump()

def remove_pipes(pipes, remove):
	for pipe in remove:
			pipes.remove(pipe)
	return pipes

def run(config_path):
	config = neat.config.Config(neat.DefaultGenome, neat.DefaultReproduction, neat.DefaultSpeciesSet, 
		neat.DefaultStagnation, config_path)

	population = neat.Population(config)

	population.add_reporter(neat.StdOutReporter(True))
	population.add_reporter(neat.StatisticsReporter())

	winner = population.run(main, 50)

def remove_birds(ge, birds, nets, remove):
	remove.reverse()
	for index, bird in remove:
		birds.pop(index)
		nets.pop(index)
		ge.pop(index)
	return birds, nets, ge

def hits_ground(bird):
	return bird.y + bird.img.get_height() >= SCREEN_HEIGHT or bird.y <= 0