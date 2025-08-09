import helper as h
import pygame

UI_LEFT = 220

def draw_ui(screen, clock):
	# wall, beginning and end options
	grid_options = h.UI_FONT.render('Grid options', True, (0, 0, 0))
	grid_optionsrect = grid_options.get_rect()
	grid_optionsrect.center = (h.SCREEN_WIDTH - UI_LEFT + 10 + (UI_LEFT - 30) / 2, 13)
	screen.blit(grid_options, grid_optionsrect)
	pygame.draw.rect(screen, (0, 0, 0), pygame.Rect(h.SCREEN_WIDTH - UI_LEFT, 30, UI_LEFT - 10, 225), width=2)
	
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

	# hide path
	h.button_7 = pygame.draw.rect(screen, (68, 68, 68), pygame.Rect(h.SCREEN_WIDTH - UI_LEFT + 10, 215, UI_LEFT - 30, 30))
	text7 = h.UI_FONT.render('Hide path', True, (255, 255, 255, 0.5))
	text7rect = text7.get_rect()
	text7rect.center = (h.SCREEN_WIDTH - UI_LEFT + 10 + (UI_LEFT - 30) / 2, 230)
	screen.blit(text7, text7rect)

	# algorithms
	algorithms = h.UI_FONT.render('Run algorithms', True, (0, 0, 0))
	algorithmsrect = algorithms.get_rect()
	algorithmsrect.center = (h.SCREEN_WIDTH - UI_LEFT + 10 + (UI_LEFT - 30) / 2, 268)
	screen.blit(algorithms, algorithmsrect)
	pygame.draw.rect(screen, (0, 0, 0), pygame.Rect(h.SCREEN_WIDTH - UI_LEFT, 285, UI_LEFT - 10, 85), width=2)

	# run WA* algorithm
	h.button_5 = pygame.draw.rect(screen, (68, 68, 68), pygame.Rect(h.SCREEN_WIDTH - UI_LEFT + 10, 295, UI_LEFT - 30, 30))
	text5 = h.UI_FONT.render('Run WA-star', True, (255, 255, 255, 0.5))
	text5rect = text5.get_rect()
	text5rect.center = (h.SCREEN_WIDTH - UI_LEFT + 10 + (UI_LEFT - 30) / 2, 310)
	screen.blit(text5, text5rect)

	# run Dijkstra's
	h.button_8 = pygame.draw.rect(screen, (68, 68, 68), pygame.Rect(h.SCREEN_WIDTH - UI_LEFT + 10, 330, UI_LEFT - 30, 30))
	text8 = h.UI_FONT.render("Run Dijkstra's", True, (255, 255, 255, 0.5))
	text8rect = text8.get_rect()
	text8rect.center = (h.SCREEN_WIDTH - UI_LEFT + 10 + (UI_LEFT - 30) / 2, 345)
	screen.blit(text8, text8rect)

	# Draw options
	options = h.UI_FONT.render('Draw options / Help', True, (0, 0, 0))
	optionsrect = options.get_rect()
	optionsrect.center = (h.SCREEN_WIDTH - UI_LEFT + 10 + (UI_LEFT - 30) / 2, 383)
	screen.blit(options, optionsrect)
	pygame.draw.rect(screen, (0, 0, 0), pygame.Rect(h.SCREEN_WIDTH - UI_LEFT, 400, UI_LEFT - 10, 85), width=2)

	# open options menu
	h.button_9 = pygame.draw.rect(screen, (68, 68, 68), pygame.Rect(h.SCREEN_WIDTH - UI_LEFT + 10, 410, UI_LEFT - 30, 30))
	text9 = h.UI_FONT.render("Open options", True, (255, 255, 255, 0.5))
	text9rect = text9.get_rect()
	text9rect.center = (h.SCREEN_WIDTH - UI_LEFT + 10 + (UI_LEFT - 30) / 2, 425)
	screen.blit(text9, text9rect)

	# open help menu
	h.button_10 = pygame.draw.rect(screen, (68, 68, 68), pygame.Rect(h.SCREEN_WIDTH - UI_LEFT + 10, 445, UI_LEFT - 30, 30))
	text10 = h.UI_FONT.render("Help", True, (255, 255, 255, 0.5))
	text10rect = text10.get_rect()
	text10rect.center = (h.SCREEN_WIDTH - UI_LEFT + 10 + (UI_LEFT - 30) / 2, 460)
	screen.blit(text10, text10rect)

	# statistics
	statistics = h.UI_FONT.render('Statistics', True, (0, 0, 0))
	statisticsrect = statistics.get_rect()
	statisticsrect.center = (h.SCREEN_WIDTH - UI_LEFT + 10 + (UI_LEFT - 30) / 2, 498)
	screen.blit(statistics, statisticsrect)
	pygame.draw.rect(screen, (0, 0, 0), pygame.Rect(h.SCREEN_WIDTH - UI_LEFT, 515, UI_LEFT - 10, 185), width=2)

	# grid dimensions
	button11 = pygame.draw.rect(screen, (68, 68, 68), pygame.Rect(h.SCREEN_WIDTH - UI_LEFT + 10, 525, UI_LEFT - 30, 60))
	text11 = h.UI_FONT.render("Grid dimensions:", True, (255, 255, 255, 0.5))
	text11rect = text11.get_rect()
	text11rect.center = (h.SCREEN_WIDTH - UI_LEFT + 10 + (UI_LEFT - 30) / 2, 540)
	screen.blit(text11, text11rect)
	text11_ = h.UI_FONT.render(str((h.rows, h.columns, h.depth)), True, (255, 255, 255, 0.5))
	text11_rect = text11_.get_rect()
	text11_rect.center = (h.SCREEN_WIDTH - UI_LEFT + 10 + (UI_LEFT - 30) / 2, 565)
	screen.blit(text11_, text11_rect)

	# path length
	button12 = pygame.draw.rect(screen, (68, 68, 68), pygame.Rect(h.SCREEN_WIDTH - UI_LEFT + 10, 590, UI_LEFT - 30, 60))
	text12 = h.UI_FONT.render("Path lenght:", True, (255, 255, 255, 0.5))
	text12rect = text12.get_rect()
	text12rect.center = (h.SCREEN_WIDTH - UI_LEFT + 10 + (UI_LEFT - 30) / 2, 605)
	screen.blit(text12, text12rect)
	path_lenght = None
	if len(h.path) == 0:
		path_lenght = "No path yet"
	else:
		path_lenght = str(len(h.path))
	text12_ = h.UI_FONT.render(path_lenght, True, (255, 255, 255, 0.5))
	text12_rect = text12_.get_rect()
	text12_rect.center = (h.SCREEN_WIDTH - UI_LEFT + 10 + (UI_LEFT - 30) / 2, 630)
	screen.blit(text12_, text12_rect)

	# fps
	buttonfps = pygame.draw.rect(screen, (68, 68, 68), pygame.Rect(h.SCREEN_WIDTH - UI_LEFT + 10, 660, UI_LEFT - 30, 30))
	fps_text = h.UI_FONT.render("FPS: " + str(round(clock.get_fps(), 2)), True, (255, 255, 255, 0.5))
	fps_text_rect = fps_text.get_rect()
	fps_text_rect.center = (h.SCREEN_WIDTH - UI_LEFT + 10 + (UI_LEFT - 30) / 2, 675)
	screen.blit(fps_text, fps_text_rect)

