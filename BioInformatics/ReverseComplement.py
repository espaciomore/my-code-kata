def ReverseComplement(pattern):

	reversedSeq = []

	complements = {
	  'A': 'T',
	  'T': 'A',
	  'C': 'G',
	  'G': 'C'
		}

	index  = len(pattern)


	while index > 0:

		nucleotide = pattern[index - 1]

		reversedSeq.append(complements[nucleotide])

		index = index - 1


	reverseComplement = ''.join(reversedSeq)


	return reverseComplement
