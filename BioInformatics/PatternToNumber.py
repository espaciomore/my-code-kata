from SymbolToNumber import *


def PatternToNumber(pattern):

	if len(pattern) == 0:

		return 0

	symbol = pattern[-1]

	prefix = pattern[0:len(pattern) - 1] if len(pattern) > 1 else ''
	

	return 4 * PatternToNumber(prefix) + SymbolToNumber(symbol)
