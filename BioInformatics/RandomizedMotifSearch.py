from Helpers import *
from MostProbable import *

import random

random.seed(0)


def RandomMotifs(dna, k, t):
	
	random_motifs = []


	for dna_string in dna:

		r = random.choice(range(len(dna_string) - k))

		random_motifs.append(dna_string[r:r+k])


	return random_motifs


def RandomizedMotifSearch(dna, k, t):

	motifs = RandomMotifs(dna, k, t)
	
	best_motifs = []

	best_score = float('-inf')
	
	idle = 0

	
	while True:

		profile = Profile(motifs, laplaceRule=True)
	
		motifs = MostProbableMotifs(dna, k, profile)
		
		motifs_score = Score(motifs)

		
		if motifs_score > best_score:
	
			best_motifs = motifs[:]

			best_score = motifs_score

		else:

			break

	
	return best_motifs		


def LoopedRandomizedMotifSearch(dna, k, t, times=1000):

	best_motifs = []

	best_score = float('-inf')


	for i in range(0, times):

		motifs = RandomizedMotifSearch(dna, k, t)

		motifs_score = Score(motifs)


		if motifs_score > best_score:

			best_motifs = motifs[:]

			best_score = motifs_score


	return best_motifs
