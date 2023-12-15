import numpy as np
from scipy.io import wavfile
import os
import matplotlib.pyplot as plt


filepath = os.path.join(os.getcwd(), "Python projects", "Guitar string simulation", "Videos and audio files", "notes")


_, A2 = wavfile.read(filepath + r"\A2.wav")
_, A3 = wavfile.read(filepath + r"\A3.wav")
_, A4 = wavfile.read(filepath + r"\A4.wav")
_, B3 = wavfile.read(filepath + r"\B3.wav")
_, B4 = wavfile.read(filepath + r"\B4.wav")
_, C3 = wavfile.read(filepath + r"\C3.wav")
_, C4 = wavfile.read(filepath + r"\C4.wav")
_, D3 = wavfile.read(filepath + r"\D3.wav")
_, D4 = wavfile.read(filepath + r"\D4.wav")
_, E3 = wavfile.read(filepath + r"\E3.wav")
_, E4 = wavfile.read(filepath + r"\E4.wav")
_, F3 = wavfile.read(filepath + r"\F3.wav")
_, F4 = wavfile.read(filepath + r"\F4.wav")
_, G3 = wavfile.read(filepath + r"\G3.wav")
_, G4 = wavfile.read(filepath + r"\G4.wav")
_, E2 = wavfile.read(filepath + r"\E2.wav")
_, F2 = wavfile.read(filepath + r"\F2.wav")
_, F2_sharp = wavfile.read(filepath + r"\F2#.wav")


filepath = os.path.join(os.getcwd(), "Python projects", "Guitar string simulation", "Videos and audio files", "sections")

section_length = 80000
quarter_note = section_length // 4
eight_note = section_length // 8
sixteenth_note = section_length // 16


first = np.concatenate((D4[0:sixteenth_note], E4[0:sixteenth_note], D4[0:sixteenth_note], C4[0:sixteenth_note]))
wavfile.write(filepath + r"\first.wav", 20000, first.astype(np.float32))

second1 = np.concatenate((G3[0:sixteenth_note], A3[0:sixteenth_note], F3[0:eight_note] + C4[0:eight_note])) + 0.5 * E2[0:quarter_note]
second2 = np.concatenate((np.zeros(sixteenth_note), A3[0:sixteenth_note], F3[0:sixteenth_note], E4[0:sixteenth_note])) + 0.5 * E2[0:quarter_note]
second3 = np.concatenate((np.zeros(eight_note), F3[0:eight_note])) + 0.5 * (E4[0:quarter_note] + E2[0:quarter_note])
second4 = first + 0.5 * F2_sharp[0:quarter_note]
second = np.concatenate((second1, second2, second3, second4))
wavfile.write(filepath + r"\second.wav", 20000, second.astype(np.float32))

third1 = np.concatenate((G3[0:sixteenth_note], A3[0:sixteenth_note], E3[0:eight_note] + C4[0:eight_note])) + 0.5 * E2[0:quarter_note]
third2 = np.concatenate((np.zeros(sixteenth_note), A3[0:sixteenth_note], F3[0:eight_note] + E4[0:eight_note])) + 0.5 * E2[0:quarter_note]
third3 = np.concatenate((D4[0:eight_note], D3[0:eight_note])) + 0.5 * F2_sharp[0:quarter_note]
third4 = first + 0.5 * F2[0:quarter_note]
third = np.concatenate((third1, third2, third3, third4))
wavfile.write(filepath + r"\third.wav", 20000, third.astype(np.float32))

secondthird = np.concatenate((second, third))
wavfile.write(filepath + r"\secondthird.wav", 20000, secondthird.astype(np.float32))

fourth1 = second1
fourth2 = np.concatenate((np.zeros(sixteenth_note), A3[0:sixteenth_note], F3[0:sixteenth_note], C4[0:sixteenth_note])) + 0.5 * E2[0:quarter_note]
fourth3 = np.concatenate((G4[0:sixteenth_note], E4[0:sixteenth_note], F3[0:sixteenth_note], C4[0:sixteenth_note])) + 0.5 * E2[0:quarter_note]
fourth4 = np.concatenate((np.zeros(sixteenth_note), D4[0:sixteenth_note], D3[0:sixteenth_note], E4[0:eight_note])) + 0.5 * F2_sharp[0:quarter_note + sixteenth_note]
fourth = np.concatenate((fourth1, fourth2, fourth3, fourth4))
wavfile.write(filepath + r"\fourth.wav", 20000, fourth.astype(np.float32))

secondthirdfourth = np.concatenate((secondthird, fourth))
wavfile.write(filepath + r"\secondthirdfourth.wav", 20000, secondthirdfourth.astype(np.float32))

firstend1 = np.concatenate((np.zeros(eight_note), E3[0:eight_note] + C4[0:eight_note])) + 0.5 * A2[0:quarter_note]
firstend2 = np.concatenate((np.zeros(sixteenth_note), A3[0:sixteenth_note], E3[0:sixteenth_note], C4[0:sixteenth_note])) + 0.5 * A2[0:quarter_note]
firstend3 = firstend1
firstend4 = second4
firstend = np.concatenate((firstend1, firstend2, firstend3, firstend4))
wavfile.write(filepath + r"\firstend.wav", 20000, firstend.astype(np.float32))

secondend1 = firstend1
secondend2 = firstend2
secondend3 = np.concatenate((A2[0:eight_note], E3[0:eight_note] + C4[0:eight_note])) # should be A2[0:eight_note], F2_sharp[0:quarter_note] concatanated as well if I continued the song
secondend = np.concatenate((secondend1, secondend2, secondend3))
wavfile.write(filepath + r"\secondend.wav", 20000, secondend.astype(np.float32))

final = np.concatenate((first, secondthirdfourth, firstend, secondthirdfourth, secondend))
wavfile.write(filepath + r"\finalv2.wav", 20000, final.astype(np.float32))
