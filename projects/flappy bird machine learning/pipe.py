from constants import *
import random


class Pipe:
    def __init__(self, x):
        self.x = x
        self.img_bottom = PIPE_IMG_BOTTOM
        self.img_top = PIPE_IMG_TOP
        self.bottom_y = random.randrange(GAP + 100, SCREEN_HEIGHT - 100)
        self.top_y = self.bottom_y - GAP
        self.top_y_draw = self.top_y - self.img_top.get_height()
        self.passed = False

    def move(self):
        self.x -= PIPE_VEL

    def draw(self, win):
        win.blit(self.img_top, (self.x, self.top_y_draw))
        win.blit(self.img_bottom, (self.x, self.bottom_y))

    def collide(self, bird):
        bird_mask = bird.get_mask()
        top_mask = pygame.mask.from_surface(self.img_top)
        bottom_mask = pygame.mask.from_surface(self.img_bottom)

        top_offset = (self.x - bird.x, self.top_y_draw - round(bird.y))
        bottom_offset = (self.x - bird.x, self.bottom_y - round(bird.y))

        bottom_point = bird_mask.overlap(bottom_mask, bottom_offset)
        top_point = bird_mask.overlap(top_mask, top_offset)
        return bottom_point or top_point

    def passed_bird(self, bird):
        return bird.x > self.x

