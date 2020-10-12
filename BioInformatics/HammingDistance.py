def HammingDistance(p, q):

	distance = 0


	for i in range(0, len(p)):

		if p[i] != q[i]:

			distance += 1


	return distance
	