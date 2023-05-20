import pygame

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
PIPE_VEL = 5
pygame.font.init()
FONT = pygame.font.SysFont("Timesnewroman", 50)
