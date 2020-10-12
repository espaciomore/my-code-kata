def PatternCount(text, pattern):

  count = 0


  for i in range(0, len(text) - len(pattern)):

    if text[i:i+len(pattern)] == pattern:

      count = count + 1


  return count
