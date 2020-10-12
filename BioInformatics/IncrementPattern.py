def IncrementPattern(pattern):

	new_pattern = ''

	value_map = {
	  'A': 0, 'C': 1, 'G': 2, 'T': 3,
	  0: 'A', 1: 'C', 2: 'G', 3: 'T'
	}

	carry = True

	for i in range(0, len(pattern)):

		next_value = value_map.get(pattern[len(pattern) - 1 - i])

		next_value += 1 if carry else 0

		if next_value > 3:

			next_value = 0

			carry = True

		else:

			carry = False	

		new_pattern = value_map.get(next_value) + new_pattern


	return new_pattern
