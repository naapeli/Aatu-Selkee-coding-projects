import pygame

BIRD_IMG = pygame.transform.scale(pygame.image.load(r"pictures\bird.png"), (150, 150))
PIPE_IMG_BOTTOM = pygame.image.load(r"pictures\pipe.png")
PIPE_IMG_TOP = pygame.transform.flip(PIPE_IMG_BOTTOM, False, True)
SCREEN_WIDTH = 400
SCREEN_HEIGHT = 600
BG_SIZE = 600
GAP = 200
PIPE_VEL = 5
pygame.font.init()
FONT = pygame.font.SysFont("Timesnewroman", 50)
