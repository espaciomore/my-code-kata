from Helpers import *
from MostProbable import *


def GreedyMotifSearch(dna, k, t, laplaceRule=False):

	bests = BestMotifs(dna, k)


	for i in range(0, len(dna[0]) - k):

		motifs = [ dna[0][i:i+k] ]
		

		for j in range(1, t):

			profile = Profile(motifs, laplaceRule)

			motifs.append( MostProbable(dna[j], k, profile) )
		
		if Score(motifs) >= Score(bests):

			bests = motifs


	return bests			
