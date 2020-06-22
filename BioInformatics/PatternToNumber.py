def PatternToNumber(pattern):
	number = 0
	value = {
	  'A': 0,
	  'C': 1,
	  'G': 2,
	  'T': 3
		}
	index  = len(pattern)
	while index > 0:
		number += value[pattern[-index]] * pow(4, index - 1)
		index = index - 1

	return number

import sys

print(PatternToNumber(sys.argv[1]))