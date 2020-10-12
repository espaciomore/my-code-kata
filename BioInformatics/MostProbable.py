from Helpers import *


def MostProbable(text, k, profile):

	probabilities = {}


	for i in range(0, len(text) - k):

		pattern = text[i:i+k]

		if pattern not in probabilities.keys():

			probabilities[pattern] = ComputeProbability(pattern, profile)

	
	most_probable = text[0:k]

	pr = float('-inf')
	

	for pattern in probabilities.keys():

		if pr < probabilities.get(pattern):

			pr = probabilities.get(pattern)

			most_probable = pattern


	return most_probable


def MostProbableMotifs(dna, k, profile):

	motifs = []


	for text in dna:

		motif = MostProbable(text, k, profile)

		motifs.append(motif)


	return motifs		
			