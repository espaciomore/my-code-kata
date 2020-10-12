from NumberToSymbol import *
	

def NumberToPattern(index, k):

	if k == 1:

		return NumberToSymbol(index)

	prefix_index, remainder = divmod(index, 4)

	symbol = NumberToSymbol(remainder)

	prefix_pattern = NumberToPattern(prefix_index, k - 1)


	return prefix_pattern + symbol
