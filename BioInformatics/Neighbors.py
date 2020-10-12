from HammingDistance import *


def Neighbors(pattern, d):

	if d == 0:

		return [pattern]

	if len(pattern) == 1:

		return ['A', 'C', 'G', 'T']

	neighborhood = []

	suffix_neighbors = Neighbors(pattern[1:], d)


	for text in suffix_neighbors:

		if HammingDistance(pattern[1:], text) < d:

			for n in ['A', 'C', 'G', 'T']:

				neighborhood.append(n + text)

		else:

			neighborhood.append(pattern[0] + text)


	return neighborhood
