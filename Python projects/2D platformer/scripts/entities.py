import pygame


class physics_entity:
	def __init__(self, animations):
		self.animations = animations
		self.position = [0, 0]
		self.velocity = [0, 0]
		self.movement = [False, False]
		self.gravity = 1
		self.speed = 3
		self.collides = {"up": False, "down": False, "left": False, "right": False}
		self.jump_counter = 2
		self.jump_strength = 14
		self.size = (23, 64)

		self.action = ""
		self.animation_offset = (-3, -7)
		self.flip = True
		self.current_animation = self.animations["idle"].copy()

	def update(self, collision_tiles):
		self.collides = {"up": False, "down": False, "left": False, "right": False}

		self.velocity[1] = max(min(self.velocity[1] + self.gravity, 7), -15)

		frame_movement = (self.movement[1] - self.movement[0] + self.velocity[0], self.velocity[1])

		self.position[1] += frame_movement[1]
		collision_rect = self.get_rect()
		for collision_tile in collision_tiles:
			if collision_rect.colliderect(collision_tile):
				if frame_movement[1] > 0:
					collision_rect.bottom = collision_tile.top
					self.collides["down"] = True
					self.jump_counter = 2
					if not self.movement[0] and not self.movement[1]:
						self.set_action("idle")
					else:
						self.set_action("run")
				if frame_movement[1] < 0:
					collision_rect.top = collision_tile.bottom
					self.collides["up"] = True
				self.position[1] = collision_rect.y


		self.position[0] += frame_movement[0] * self.speed
		collision_rect = self.get_rect()
		for collision_tile in collision_tiles:
			if collision_rect.colliderect(collision_tile):
				if frame_movement[0] > 0:
					collision_rect.right = collision_tile.left
					self.collides["right"] = True
				if frame_movement[0] < 0:
					collision_rect.left = collision_tile.right
					self.collides["left"] = True
				self.position[0] = collision_rect.x + self.animation_offset[0]

		if self.collides["down"] or self.collides["up"]:
			self.velocity[1] = 0

		if self.movement[0]:
			self.flip = False
		if self.movement[1]:
			self.flip = True

		self.current_animation.update()

	def set_action(self, action):
		if action != self.action:
			self.action = action
			self.current_animation = self.animations[action].copy()

	def render(self, surface, offset=[0, 0]):
		render_position = (self.position[0] - offset[0] + self.animation_offset[0], self.position[1] - offset[1])
		surface.blit(pygame.transform.flip(self.current_animation.current_image(), self.flip, False), render_position)

	def get_rect(self):
		return pygame.Rect((self.position[0] - self.animation_offset[0], self.position[1]), self.size)
