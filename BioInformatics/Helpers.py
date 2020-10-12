def Dna(text, s):

	dna_strings = []


	for i in range(0, len(text), s):

		dna_strings.append(text[i:i+s])


	return dna_strings	


def Motifs(dna, k):

	motifs = []


	for dna_string in dna:

		row = []

		for nucleotide in dna_string:

			row.append(nucleotide)

		motifs.append(row)	


	return motifs


def BestMotifs(dna, k):

	bests = []


	for dna_string in dna:

		bests.append(dna_string[0:k])


	return bests		


def Count(motifs):

	counts = {
		'A': [0 for j in motifs[0]],
		'C': [0 for j in motifs[0]],
		'G': [0 for j in motifs[0]],
		'T': [0 for j in motifs[0]]
	}
	

	for motif in motifs:

		for j in range(0, len(motif)):

			nucleotide = motif[j].upper()

			if nucleotide in ['A', 'C', 'G', 'T']:

				counts.get(nucleotide)[j] += 1
	

	return counts	


def Profile(motifs, laplaceRule=False):

	profile = Count(motifs)

	t = float(len(motifs))


	for nucleotide in ['A', 'C', 'G', 'T']:

		for j in range(0, len(profile.get(nucleotide))):

			profile.get(nucleotide)[j] = (profile.get(nucleotide)[j] + (1 if laplaceRule else 0)) / (t + 4 if laplaceRule else t)
	

	return profile


def Score(motifs):

	counts = Count(motifs)

	score = 0
	

	for j in range(0, len(motifs[0])):

		score += max( counts.get('A')[j], counts.get('C')[j], counts.get('G')[j], counts.get('T')[j] )


	return score	


def Consensus(motifs, laplaceRule=False):

	profile = Profile(motifs, laplaceRule)

	logo = []


	for j in range(0, len(profile.get('A'))):

		l = 'A'
		l = 'C' if profile.get('C')[j] >= profile.get(l)[j] else l
		l = 'G' if profile.get('G')[j] >= profile.get(l)[j] else l
		l = 'T' if profile.get('T')[j] >= profile.get(l)[j] else l

		logo.append(l)


	return logo	


def ComputeProbability(pattern, profile):

	pr = float(1.0)


	for i in range(0, len(pattern)):

		nucleotide = pattern[i]

		pr = pr * profile.get(nucleotide)[i]


	return pr
