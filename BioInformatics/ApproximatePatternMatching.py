from HammingDistance import *


def ApproximatePatternMatching(pattern, text, d):

	matches = []


	for i in range(0, len(text) - len(pattern) + 1):

		if HammingDistance(pattern, text[i:i+len(pattern)]) <= d:

			matches.append(str(i))


	return matches
