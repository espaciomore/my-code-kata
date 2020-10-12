from HammingDistance import *


def DistanceBetweenPatternAndStrings(pattern, dna):

	k = len(pattern)

	distance = 0


	for dna_string in dna:

		hd = float('inf')


		for i in range(0, len(dna_string) - k):

			pattern_ = dna_string[i:i+k]

			hd_ = HammingDistance(pattern, pattern_)

			if hd > hd_:

				hd = hd_


		distance += hd


	return distance	
