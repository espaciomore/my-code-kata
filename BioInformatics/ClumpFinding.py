from FrequencyArray import *
from NumberToPattern import *


def ClumpFinding(genome, K, L, t):

	clump = []


	for i in range(0, pow(4, k)):

		clump.append(0)


	for i in range(0, len(genome) - L):

		text = genome[i:i+L]

		frequency_array = FrequencyArray(text, k)


		for j in range(0, pow(4, k)):

			if frequency_array[j] >= t:

				clump[j] = 1


	patterns = []

				
	for i in range(0, pow(4, k)):

		if clumb[i] == 1:

			pattern  = NumberToPattern(i, k)	

			patterns.append(pattern)


	return patterns
		