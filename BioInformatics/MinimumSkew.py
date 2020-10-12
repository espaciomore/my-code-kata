from SymbolToNumber import *
from Skew import *


def MinimumSkew(genome):

	skew = Skew(genome)

	minimum = min(skew)

	positions = []
	

	for i in range(0, len(skew)):

		if skew[i] == minimum:

			positions.append(i + 1)


	return positions
