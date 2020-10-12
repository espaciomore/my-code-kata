from Helpers import *

import random

random.seed(0)


def RandomNumber(probabilities):

	sum_ = sum(probabilities)

	numbers = []

	normalizer = 1000


	for i in range(0, len(probabilities)):
		
		weight = int(round(normalizer * probabilities[i]/float(sum_)))
		
		numbers += [i] * (weight if weight > 0 else 1)
	

	number = random.choice(numbers)	
	

	return number


def RandomMotifs(dna, k, t):
	
	random_motifs = []


	for dna_string in dna:

		r = random.choice(range(len(dna_string) - k))

		random_motifs.append(dna_string[r:r+k])


	return random_motifs


def RandomPattern(profile, text, k):

	probabilities = []


	for i in range(0, len(text) - k):

		pattern = text[i:i+k]
		
		p = ComputeProbability(pattern, profile)

		probabilities.append(p)

	
	j = RandomNumber(probabilities)

	pattern = text[j:j+k]


	return pattern


def GibbsSampler(dna, k, t, N):

	motifs = RandomMotifs(dna, k, t)

	best_motifs = []

	best_score = float('-inf')


	for j in range(0, N):

		i = random.choice(range(t))
		
		motifs.pop(i)

		profile = Profile(motifs, laplaceRule=True)

		random_motif = RandomPattern(profile, dna[i], k)

		motifs.insert(i, random_motif)
		
		motifs_score = Score(motifs)


		if motifs_score > best_score:
	
			best_motifs = motifs[:]

			best_score = motifs_score

	
	return best_motifs	 


def LoopedGibbsSampler(dna, k, t, N, times=1000):

	best_motifs = []

	best_score = float('-inf')

	
	for i in range(0, times):

		motifs = GibbsSampler(dna, k, t, N)
		
		motifs_score = Score(motifs)


		if motifs_score > best_score:

			best_motifs = motifs[:]

			best_score = motifs_score


	return best_motifs
