from PatternCount import *
from ApproximatePatternCount import *
from ReverseComplement import *


def FrequentWordsWithoutMismatchCount(text, k):
  
  count = {}

  max_count = -1


  for i in range(0, len(text) - k):

    pattern = text[i:i+k]

    count[pattern] = PatternCount(text, pattern)

    if count[pattern] > max_count:

      max_count = count[pattern]


  frequentPatterns = []


  for pattern in  count.keys():

    if count[pattern] >= max_count:

      frequentPatterns.append(pattern)


  return frequentPatterns


def FrequentWords(text, k, patterns={}, mismatches=0, rc=False):

  counts = {}

  max_count = 0


  for i in range(0, len(text) - k):

    pattern = text[i:i+k]

    if pattern not in patterns and pattern not in counts:

      count = PatternCount(text, pattern) if mismatches <= 0 else ApproximatePatternCount(pattern, text, mismatches)

      if rc:

        count = count + (PatternCount(text, ReverseComplement(pattern)) if mismatches <= 0 else ApproximatePatternCount(ReverseComplement(pattern), text, mismatches))
      
      counts[pattern] = count

      if rc:

        counts[ReverseComplement(pattern)] = count

      if count > max_count:

        max_count = count
  

  patterns = {}


  for pattern in counts:

    if counts[pattern] == max_count and pattern not in patterns:

      patterns[pattern] = max_count


  return patterns
