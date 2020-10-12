from Helpers import *
from math import log


def Entropy(motifs):

	profile = Profile(motifs)

	probabilities = [
		profile.get('A'),
		profile.get('C'),
		profile.get('G'),
		profile.get('T')
	]

	psum = []


	for i in range(0, len(probabilities)):

		r = []


		for j in range(0, len(probabilities[i])):

			pi = probabilities[i][j]

			r.append(pi*log(pi, 2) if pi > 0 else 0)

		psum.append(r)
			
			
	entropy = sum([sum(i) for i in psum])


	return -entropy
