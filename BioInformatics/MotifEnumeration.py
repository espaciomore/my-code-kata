from ApproximatePatternCount import *
from Neighbors import *
from ReverseComplement import *

@profile
def MotifEnumation(dna, k, d):

	patterns = []

	text = ''.join(dna)
	

	for i in range(0, len(text) - k):

		pattern = text[i:i+k]


		for pattern_ in Neighbors(pattern, d):

			matched = True


			for dna_string in dna:

				if ApproximatePatternCount(pattern_, dna_string, d) == 0:

					matched = False


			if matched and pattern_ not in patterns:

				patterns.append(pattern_)


	return patterns
