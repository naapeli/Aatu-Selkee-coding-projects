import helper as h
import pygame


class Bird:
    def __init__(self, x, y):
        self.x = x
        self.y = y
        self.vel = 0
        self.acceleration = 0.1
        self.tick_count = 0
        self.terminal_velocity = 0.5
        self.img = h.BIRD_IMG
        self.tilt = 0

    def jump(self):
        self.vel = -5
        self.tick_count = 0

    def move(self):
        self.tick_count += 1
        self.vel = min(self.vel + self.acceleration * self.tick_count, self.terminal_velocity)
        d = self.vel * self.tick_count
        self.y += d


    def draw(self, win):
        rotated_img = pygame.transform.rotate(self.img, -2*self.vel)
        new_rect = rotated_img.get_rect(center=self.img.get_rect(topleft=(self.x, self.y)).center)
        win.blit(rotated_img, new_rect.topleft)

    def get_mask(self):
        return pygame.mask.from_surface(self.img)
