from FrequencyArray import *
from NumberToPattern import *
from PatternToNumber import *


def ClumpFinding(genome, k, L, t):

	clump = []


	for i in range(0, pow(4, k)):

		clump.append(0)


	frequency_array = FrequencyArray(text, k)


	for i in range(0, pow(4, k)):

			if frequency_array[i] >= t:

				clump[i] = 1


	for i in range(1, len(genome) - L):

		pattern = genome[i+L-k:i+L]

		index = PatternToNumber(pattern)

		frequency_array[i] = frequency_array[index] + 1

		if frequency_array[index] >= t:

			clump[index] = 1


	patterns = []
				

	for i in range(0, pow(4, k)):

		if clumb[i] == 1:

			pattern  = NumberToPattern(i, k)	

			patterns.append(pattern)


	return patterns
	