module Day3
  def transform_str(inputs)
    transform_arr inputs.split(',')
  end

  def transform_arr(inputs)
    inputs.map { |sd| arr = sd.split(''); [arr.shift,arr.join.to_i] }
  end

  def transform_f(sd)
    case sd[0].upcase.to_sym
    when :R
      [ sd[1], 0, sd[1].abs ]
    when :L
      [ -sd[1], 0, sd[1].abs ]
    when :U
      [ 0, sd[1], sd[1].abs ]
    when :D
      [ 0, -sd[1], sd[1].abs ]
    else
      [ 0, 0, 0 ]
    end
  end

  def S(dxyz)
    [
      dxyz[0][0] + dxyz[1][0], 
      dxyz[0][1] + dxyz[1][1],
      dxyz[0][2] + dxyz[1][2]  
    ]
  end

  def jumps(sd, xyz)
    _jumps = []
    xyz2 = transform_f(sd)

    x = xyz2[0]
    y = xyz2[1]
    z = xyz2[2]

    (1..z).step(1) do |n|
      jump = S( [ xyz, [  n * x/z, n * y/z, n * 1 ] ] )
      _jumps << jump
    end

    _jumps
  end

  def manhattan_distance(inputs_1, inputs_2)
    _inputs_1 = inputs_1.dup
    _inputs_2 = inputs_2.dup

    space_1 = []
    space_1 << [0,0,0]

    _inputs_1.each do |sd|
      space_1 += jumps( sd, space_1[-1] )
    end

    space_2 = []
    space_2 << [0,0,0]

    _inputs_2.each do |sd|
      space_2 += jumps( sd, space_2[-1] )
    end

    return [ space_1, space_2 ]
  end

  def shortest_distance(inputs_1, inputs_2)
    spaces = manhattan_distance(inputs_1, inputs_2)

    space_1 = spaces[0].map { | x, y, z | [ x, y, 0 ] }
    space_2 = spaces[1].map { | x, y, z | [ x, y, 0 ] }

    intersections = space_1 & space_2

    distances = intersections.map { |x,y,z| x.abs + y.abs }.sort

    return distances[1] if distances.size > 0
  end
  
  def longest_distance(inputs_1, inputs_2)
    spaces = manhattan_distance(inputs_1, inputs_2)

    space_1 = spaces[0].map { | x, y, z | [ x, y, 0 ] }
    space_2 = spaces[1].map { | x, y, z | [ x, y, 0 ] }

    intersections = space_1 & space_2

    distances = intersections.map { |x,y,z| x.abs + y.abs }.sort

    return distances[-1] if distances.size > 0
  end

  def closest_intersection(inputs_1, inputs_2)
    spaces = manhattan_distance(inputs_1, inputs_2)

    space_1 = spaces[0].map { | x, y, z | [ x, y, 0 ] }
    space_2 = spaces[1].map { | x, y, z | [ x, y, 0 ] }

    intersections = ( space_1 & space_2 ).sort

    closest1 = spaces[0].select { |x,y,z| intersections.include? [x,y,0] }.sort
    closest2 = spaces[1].select { |x,y,z| intersections.include? [x,y,0] }.sort

    matching_closests = []
    closest1.each_index do |index|
      matching_closests << [closest1[index][0], closest1[index][1], closest1[index][2] + closest2[index][2]]
    end  
    
    return matching_closests.sort! { |a,b| a[2] <=> b[2] }[1][2]
  end  

  def puzzle
    txt = File.read('day3_puzzle.txt').to_s
    inputs = txt.split("\n")
    return [ transform_str(inputs[0]), transform_str(inputs[1]) ]
  end

  def test
    results =[]
    results << { :got => shortest_distance( [["R", 75], ["D", 30], ["R", 83], ["U", 83], ["L", 12], ["D", 49], ["R", 71], ["U", 7], ["L", 72]],
                        [["U", 62], ["R", 66], ["U", 55], ["R", 34], ["D", 71], ["R", 55], ["D", 58], ["R", 83]]),
                 :expected => 159 }
    results << { :got => shortest_distance( transform_str('R98,U47,R26,D63,R33,U87,L62,D20,R33,U53,R51'),
                        transform_str('U98,R91,D20,R16,D67,R40,U7,R15,U6,R7')),
                 :expected => 135 }
    results << { :got => closest_intersection( transform_str('R75,D30,R83,U83,L12,D49,R71,U7,L72'),
                        transform_str('U62,R66,U55,R34,D71,R55,D58,R83')),
                 :expected => 610 }
    results << { :got => closest_intersection( transform_str('R98,U47,R26,D63,R33,U87,L62,D20,R33,U53,R51'),
                        transform_str('U98,R91,D20,R16,D67,R40,U7,R15,U6,R7')),
                 :expected => 410 }    
    results << { :got => shortest_distance( puzzle[0], puzzle[1] ),
                 :expected => 860 }                                    
    results << { :got => closest_intersection( puzzle[0], puzzle[1] ),
                 :expected => 9238 }  
    passed = []; failed = []

    results.each do |result|
      if (result[:got] != result[:expected])
        failed << result
      else
        passed << result
      end
    end

    "#{passed.size} passed\n#{failed.size} failed#{'\n ' if failed.size > 0}#{failed if failed.size > 0}"
  end
end

# include Day3
# Day3.test
# EOF