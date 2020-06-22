def NumberToPattern(number, k):
	remainders = []
	value = {
	  0: 'A',
	  1: 'C',
	  2: 'G',
	  3: 'T'
		}
	result = number
	for i in range(1, k):
		if result >= 4:
			result, remainder = divmod(result, 4)
			remainders.append(value[remainder])
			if result < 4:
				remainders.append(value[result])
		else:
			remainders.append(value[0])		

	pattern = ''.join(reversed(remainders))

	return pattern		

# import sys

# print(NumberToPattern(int(sys.argv[1]), int(sys.argv[2])))