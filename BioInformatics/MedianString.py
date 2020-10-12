from HammingDistance import *
from IncrementPattern import *


def MedianStringWithHammingDistance(dna, k):

	distance = k * len(dna) + 1

	pattern = 'T' * k

	median = ''


	for i in range(0, pow(4, k)):

		pattern = IncrementPattern(pattern)

		d_sum = 0


		for dna_string in dna:

			min_hd = distance


			for j in range(0, len(dna_string) - k):

				hd = HammingDistance(pattern, dna_string[j:j+k])

				if min_hd > hd:

					min_hd = hd


			d_sum += min_hd


		if distance > d_sum:
			distance = d_sum
			median = pattern


	return median	


from DistanceBetweenPatternAndStrings import *
from NumberToPattern import *


def MedianString(dna, k):

	distance = float('inf')

	median = ''


	for i in range(0, pow(4, k)):

		pattern = NumberToPattern(i, k)

		distance_ = DistanceBetweenPatternAndStrings(pattern, dna)

		if distance >= distance_:

			distance = distance_

			median = pattern

			if distance == distance_:

				print(median)


	return median		
