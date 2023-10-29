import helper as h
import pygame
from bird import Bird
from pipe import Pipe
import neat
import os

def main(genomes, config):
	clock = pygame.time.Clock()

	nets = []
	ge = []
	birds = []

	for _, genome in genomes:
		net = neat.nn.FeedForwardNetwork.create(genome, config)
		nets.append(net)
		birds.append(Bird(50, 200))
		genome.fitness = 0
		ge.append(genome)

	pipes = [Pipe(400), Pipe(700)]
	score = 0
	h.generation += 1

	while True:
		h.detect_event(birds)

		pipe_index = 0
		if len(birds) > 0:
			if len(pipes) > 1 and pipes[0].passed_bird(birds[0]):
				pipe_index = 1
		else:
			break

		removable_pipes = []
		removable_birds = []
		for pipe in pipes:
			for i, bird in enumerate(birds):
				if pipe.collide(bird):
					ge[i].fitness -= 1
					removable_birds.append((i, bird))

			if pipe.x + pipe.img_top.get_width() < 0:
				removable_pipes.append(pipe)

			if not pipe.passed and pipe.passed_bird(birds[0]):
				pipe.passed = True
				score += 1
				for genome in ge:
					genome.fitness += 5
				pipes.append(Pipe(650 - h.PIPE_IMG_BOTTOM.get_width()))
				
			pipe.move()

		pipes = h.remove_pipes(pipes, removable_pipes)
		birds, nets, ge = h.remove_birds(ge, birds, nets, removable_birds)

		removable_birds = []
		for i, bird in enumerate(birds):
			bird.move()
			ge[i].fitness += 0.1
			output = nets[i].activate((bird.y, abs(bird.y - pipes[pipe_index].bottom_y),
				abs(bird.y - pipes[pipe_index].top_y)))

			if output[0] > 0.5:
				bird.jump()

			if h.hits_ground(bird):
				ge[i].fitness -= 1
				removable_birds.append((i, bird))

		birds, nets, ge = h.remove_birds(ge, birds, nets, removable_birds)

		h.draw_window(h.screen, birds, pipes, h.bg, score, h.generation)

		clock.tick(60)

if __name__ == "__main__":
	pygame.display.set_caption("flappy bird")

	local_dir = os.getcwd()
	config_path = os.path.join(local_dir, "config.txt")
	h.run(config_path)
