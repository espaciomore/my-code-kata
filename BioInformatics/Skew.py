from SymbolToNumber import *


def Skew(genome):

	positions = []

	positions.append(SymbolToNumber(genome[0]))


	for i in range(1, len(genome)):

		previous = positions[-1]

		current = SymbolToNumber(genome[i])

		if current == 1:

			positions.append(previous - 1)

		elif current == 2:

			positions.append(previous + 1)

		else:

			positions.append(previous + 0)


	return positions		
