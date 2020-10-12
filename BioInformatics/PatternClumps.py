def PatternClumps(genome, k, L, t, steps=1):

	matches = {}

	patterns = {}


	for i in range(0, len(genome) - L, steps):

		kmer = genome[i:i+k]
		
		if i >= L:

			zero_kmer = genome[i-L:i-L+k]

			patterns[zero_kmer] = patterns[zero_kmer] - 1

		if kmer not in patterns:

			patterns[kmer] = 1  

		else: 

			patterns[kmer] = patterns[kmer] + 1
		
		if patterns[kmer] == t:
			matches[kmer] = True		


	return [matches.keys(), len(matches)]			
