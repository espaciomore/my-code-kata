def PatternMatch(pattern, gnome):
  positions = []
  for i in range(0, len(gnome) - len(pattern)):
    if gnome[i:i+len(pattern)] == pattern:
      positions.append(str(i))
  
  return ' '.join(positions)

import os
import sys

f = open(sys.argv[1], 'r')

pattern = f.readline().strip()
gnome = f.readline().strip()

print(PatternMatch(pattern, gnome))
