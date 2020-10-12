from PatternToNumber import *
from NumberToPattern import *


def FindingFrequentWordsBySorting(text, k):

	index = []

	count = []


	for i in range(0, len(text) - k):

		pattern = text[i:i+k]

		index.append(PatternToNumber(pattern))

		count.append(1)


	sorted_index = sorted(index)


	for i in range(1, len(text) - k):

		if sorted_index[i] == sorted_index[i - 1]:

			count[i] = count[i - 1] + 1


	max_count = max(count)
	
	patterns = []


	for i in range(0, len(text) - k):

		if count[i] == max_count:

			pattern = NumberToPattern(sorted_index[i], k)

			patterns.append(pattern)


	return patterns
	