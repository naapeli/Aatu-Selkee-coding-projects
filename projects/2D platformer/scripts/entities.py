import pygame


class physics_entity:
	def __init__(self, image):
		self.image = image
		self.position = [0, 0]
		self.velocity = [0, 0]
		self.movement = [False, False]
		self.gravity = 1
		self.speed = 2
		self.collides = {"up": False, "down": False, "left": False, "right": False}
		self.jump_counter = 2
		self.jump_strength = 14

	def update(self, collision_tiles):
		self.collides = {"up": False, "down": False, "left": False, "right": False}

		self.velocity[1] = max(min(self.velocity[1] + self.gravity, 7), -15)

		frame_movement = (self.movement[1] - self.movement[0] + self.velocity[0], self.velocity[1])

		self.position[1] += frame_movement[1]
		collision_rect = self.get_collision_rect()
		for collision_tile in collision_tiles:
			if collision_rect.colliderect(collision_tile):
				if frame_movement[1] > 0:
					collision_rect.bottom = collision_tile.top
					self.collides["down"] = True
					self.jump_counter = 2
				if frame_movement[1] < 0:
					collision_rect.top = collision_tile.bottom
					self.collides["up"] = True
				self.position[1] = collision_rect.y


		self.position[0] += frame_movement[0] * self.speed
		collision_rect = self.get_collision_rect()
		for collision_tile in collision_tiles:
			if collision_rect.colliderect(collision_tile):
				if frame_movement[0] > 0:
					collision_rect.right = collision_tile.left
					self.collides["right"] = True
				if frame_movement[0] < 0:
					collision_rect.left = collision_tile.right
					self.collides["left"] = True
				self.position[0] = collision_rect.x

		if self.collides["down"] or self.collides["up"]:
			self.velocity[1] = 0

	def render(self, surface):
		surface.blit(self.image, self.position)

	def get_collision_rect(self):
		return pygame.Rect(self.position, self.image.get_size())

class player(physics_entity):
	def __init__(self, image):
		super().__init__(image)
