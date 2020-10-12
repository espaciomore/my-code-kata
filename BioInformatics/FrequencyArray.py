from PatternToNumber import *


def FrequencyArray(text, k):

	fa = []


	for i in range(0, pow(4, k)):

		fa.append(0)


	for i in range(0, len(text) - k + 1):

	  pattern = text[i:i+k]

	  j = PatternToNumber(pattern)

	  fa[j] = fa[j] + 1


	return fa
