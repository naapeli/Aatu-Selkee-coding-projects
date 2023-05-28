import helper as h
import pygame

UI_LEFT = 210

def draw_ui(screen):
	# wall, beginning and end options
	options = h.UI_FONT.render('Options', True, (0, 0, 0))
	optionsrect = options.get_rect()
	optionsrect.center = (h.SCREEN_WIDTH - UI_LEFT + 10 + (UI_LEFT - 30) / 2, 13)
	screen.blit(options, optionsrect)
	pygame.draw.rect(screen, (0, 0, 0), pygame.Rect(h.SCREEN_WIDTH - UI_LEFT, 30, UI_LEFT - 10, 190), width=2)
	
	# Toggle walls-button
	h.button_1 = pygame.draw.rect(screen, (68, 68, 68), pygame.Rect(h.SCREEN_WIDTH - UI_LEFT + 10, 40, UI_LEFT - 30, 30))
	text1 = h.UI_FONT.render('Toggle walls', True, (255, 255, 255, 0.5))
	text1rect = text1.get_rect()
	text1rect.center = (h.SCREEN_WIDTH - UI_LEFT + 10 + (UI_LEFT - 30) / 2, 55)
	screen.blit(text1, text1rect)

	# Select beginning
	h.button_2 = pygame.draw.rect(screen, (68, 68, 68), pygame.Rect(h.SCREEN_WIDTH - UI_LEFT + 10, 75, UI_LEFT - 30, 30))
	text2 = h.UI_FONT.render('Select start', True, (255, 255, 255, 0.5))
	text2rect = text2.get_rect()
	text2rect.center = (h.SCREEN_WIDTH - UI_LEFT + 10 + (UI_LEFT - 30) / 2, 90)
	screen.blit(text2, text2rect)

	# select end
	h.button_3 = pygame.draw.rect(screen, (68, 68, 68), pygame.Rect(h.SCREEN_WIDTH - UI_LEFT + 10, 110, UI_LEFT - 30, 30))
	text3 = h.UI_FONT.render('Select end', True, (255, 255, 255, 0.5))
	text3rect = text3.get_rect()
	text3rect.center = (h.SCREEN_WIDTH - UI_LEFT + 10 + (UI_LEFT - 30) / 2, 125)
	screen.blit(text3, text3rect)

	# randomise walls
	h.button_4 = pygame.draw.rect(screen, (68, 68, 68), pygame.Rect(h.SCREEN_WIDTH - UI_LEFT + 10, 145, UI_LEFT - 30, 30))
	text4 = h.UI_FONT.render('Randomise walls', True, (255, 255, 255, 0.5))
	text4rect = text4.get_rect()
	text4rect.center = (h.SCREEN_WIDTH - UI_LEFT + 10 + (UI_LEFT - 30) / 2, 160)
	screen.blit(text4, text4rect)

	# hide / show walls
	h.button_6 = pygame.draw.rect(screen, (68, 68, 68), pygame.Rect(h.SCREEN_WIDTH - UI_LEFT + 10, 180, UI_LEFT - 30, 30))
	text6 = h.UI_FONT.render('Hide / show walls', True, (255, 255, 255, 0.5))
	text6rect = text6.get_rect()
	text6rect.center = (h.SCREEN_WIDTH - UI_LEFT + 10 + (UI_LEFT - 30) / 2, 195)
	screen.blit(text6, text6rect)

	# algorithms
	algorithms = h.UI_FONT.render('Run algorithms', True, (0, 0, 0))
	algorithmsrect = algorithms.get_rect()
	algorithmsrect.center = (h.SCREEN_WIDTH - UI_LEFT + 10 + (UI_LEFT - 30) / 2, 233)
	screen.blit(algorithms, algorithmsrect)
	pygame.draw.rect(screen, (0, 0, 0), pygame.Rect(h.SCREEN_WIDTH - UI_LEFT, 250, UI_LEFT - 10, 120), width=2)

	# run A* algorithm
	h.button_5 = pygame.draw.rect(screen, (68, 68, 68), pygame.Rect(h.SCREEN_WIDTH - UI_LEFT + 10, 260, UI_LEFT - 30, 30))
	text5 = h.UI_FONT.render('Run A-star', True, (255, 255, 255, 0.5))
	text5rect = text5.get_rect()
	text5rect.center = (h.SCREEN_WIDTH - UI_LEFT + 10 + (UI_LEFT - 30) / 2, 275)
	screen.blit(text5, text5rect)
