import pygame

class tilemap:
	def __init__(self, assets):
		self.on_grid_tiles = {}
		self.off_grid_tiles = []
		self.TILESIZE = 32
		self.assets = assets
		self.collision_tile_types = {"grass"}

	def render(self, surface):
		for tile in self.off_grid_tiles:
			surface.blit(self.assets[tile["type"]][tile["variant"]], tile["position"])

		for position in self.on_grid_tiles:
			tile = self.on_grid_tiles[position]
			tile_position = (tile["position"][0] * self.TILESIZE, tile["position"][1] * self.TILESIZE)
			surface.blit(self.assets[tile["type"]][tile["variant"]], tile_position)

	def add_tile(self, indicies, type, variant, position, on_grid=True):
		if on_grid:
			self.on_grid_tiles[indicies] = {"type": type, "variant": variant, "position": position}
		else:
			self.off_grid_tiles.append({"position": position, "type": type, "variant": variant})

	def remove_tile(self, indicies, on_grid=True, position=None):
		if on_grid:
			del self.on_grid_tiles[indicies]
		else:
			for i, tile in enumerate(self.off_grid_tiles.copy()):
				if tile["position"] == position:
					self.off_grid_tiles[i].pop()
					break

	def get_neighbours(self, pixel_position):
		position = (int(pixel_position[0] // self.TILESIZE), int(pixel_position[1] // self.TILESIZE))
		neighbours = []
		neighbour_offsets = [(-1, 2), (0, 2), (1, 2), (-1, 1), (0, 1), (1, 1), (-1, 0), (0, 0), (1, 0), (-1, -1), (0, -1), (1, -1)]
		for offset in neighbour_offsets:
			neighbour_position = str(position[0] + offset[0]) + ";" + str(position[1] + offset[1])
			if neighbour_position in self.on_grid_tiles:
				neighbours.append(self.on_grid_tiles[neighbour_position])
		return neighbours

	def get_collision_tiles(self, pixel_position):
		neighbours = self.get_neighbours(pixel_position)
		collision_tiles = []
		for tile in neighbours:
			if tile["type"] in self.collision_tile_types:
				tile_rect = pygame.Rect(tile["position"][0] * self.TILESIZE, tile["position"][1] * self.TILESIZE, self.TILESIZE, self.TILESIZE)
				collision_tiles.append(tile_rect)
		return collision_tiles
