from PatternCount import *

def FrequentWords(text, k, patterns={}):
  counts = {}
  max_count = 0
  for i in range(0, len(text) - k):
    pattern = text[i:i+k]
    if pattern not in patterns and pattern not in counts:
      count = PatternCount(text, pattern)
      counts[pattern] = count
      if count > max_count:
        max_count = count

  patterns = {}
  for pattern in counts:
    if counts[pattern] == max_count and pattern not in patterns:
      patterns[pattern] = max_count

  return patterns

# import os
# import sys

# f = open(sys.argv[1], 'r')

# text = f.readline().strip()
# k = int(sys.argv[2])

# print(FrequentWords(text, k))
