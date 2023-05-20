from sys import exit
from constants import *
from bird import Bird
from pipe import Pipe


def draw_window(win, bird, pipes):
	win.blit(bg, (0, 0))
	bird.draw(win)
	for pipe in pipes:
		pipe.draw(win)
	score_text = FONT.render("Score: " + str(score), 1, (255, 255, 255))
	win.blit(score_text, (10, 10))
	pygame.display.update()


if __name__ == "__main__":
	pygame.display.set_caption("flappy bird")
	clock = pygame.time.Clock()

	bird = Bird(50, 200)
	pipes = [Pipe(400), Pipe(700)]
	score = 0
	add_pipe = False

	bg = pygame.transform.scale(pygame.image.load(r"pictures\background.jpg"), (BG_SIZE, BG_SIZE))

	while True:
		for event in pygame.event.get():
			if event.type == pygame.QUIT:
				pygame.quit()
				exit()

			if event.type == pygame.KEYDOWN:
				bird.jump()

		bird.move()
		rmv = []
		for pipe in pipes:
			if pipe.collide(bird):
				print("you lose")

			if pipe.x + pipe.img_top.get_width() < 0:
				rmv.append(pipe)

			if not pipe.passed and pipe.passed_bird(bird):
				pipe.passed = True
				add_pipe = True

			pipe.move()

		if add_pipe:
			score += 1
			pipes.append(Pipe(650))
			add_pipe = False

		for pipe in rmv:
			pipes.remove(pipe)

		if bird.y + bird.img.get_height() >= SCREEN_HEIGHT - 50 or bird.y <= 0:
			print("you lose")

		draw_window(screen, bird, pipes)

		clock.tick(30)
