# from FrequentWords import *

# def PatternClumps(genome, k, L, t, steps=1):
# 	patterns = {}
# 	for i in range(0, len(genome) - L, steps):
# 		frequentWords = FrequentWords(genome[i:i+L], k, patterns)
# 		for pattern in frequentWords:
# 			if pattern not in patterns and frequentWords[pattern] == t:
# 				patterns[pattern] = frequentWords[pattern]

# 	return [patterns.keys(), len(patterns)]	

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

# import os 
# import sys

# f = open(sys.argv[1], 'r')

# genome = f.readline().strip()
# x = f.readline().strip().split(' ')
# k = int(x[0])
# L = int(x[1])
# t = int(x[2])

# print(PatternClumps(genome, k, L, t))
