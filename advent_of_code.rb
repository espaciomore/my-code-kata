module Day2
  def reset
    @op = nil
    @first = nil
    @second = nil
  end

  def int_code(inputs)
    reset
    _inputs = inputs.dup

    _inputs.each do |val|
      if @op.nil?
        @op = val
      elsif @first.nil?
        @first = _inputs[ val ]
      elsif @second.nil?
        @second = _inputs[ val ]
      else
        if @op == 1
          result = @first + @second
        elsif @op == 2
          result = @first * @second
        elsif @op == 99
          break
        end

        _inputs[ val ] = result
        reset
      end
    end

    _inputs
  end

  def find_noun_and_verb(threshold, inputs)
    (0..99).each do |noun|
      (0..99).each do |verb|
        _inputs = inputs.dup
        _inputs[1] = noun
        _inputs[2] = verb

        results = int_code(_inputs)

        return noun,verb if results[0] == threshold
      end
    end

    nil
  end
end

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
    results << { :got => closest_intersection( transform_str('R999,U626,R854,D200,R696,D464,R54,D246,L359,U57,R994,D813,L889,U238,L165,U970,L773,D904,L693,U512,R126,D421,R732,D441,R453,D349,R874,D931,R103,D794,R934,U326,L433,D593,L984,U376,R947,U479,R533,U418,R117,D395,L553,D647,R931,D665,L176,U591,L346,D199,L855,D324,L474,U251,R492,D567,L97,D936,L683,U192,R198,U706,L339,U66,R726,D102,R274,U351,R653,D602,L695,U921,R890,D654,R981,U351,R15,U672,R856,D319,R102,D234,R248,U169,L863,U375,L412,U75,L511,U298,L303,U448,R445,U638,L351,D312,R768,D303,L999,D409,L746,U266,L16,U415,L951,D763,L976,U342,L505,U770,L228,D396,L992,U3,R243,D794,L496,U611,R587,U772,L306,D119,L470,D490,L336,U518,L734,D654,L150,U581,L874,U691,L243,U94,L9,D582,L402,U563,R468,U96,L311,D10,R232,U762,R630,D1,L674,U685,R240,D907,R394,U703,L64,U397,L810,D272,L996,D954,R797,U789,R790,D526,R103,D367,R143,D41,L539,D735,R51,D172,L33,U241,R814,D981,R748,D699,L716,U647,L381,D351,L381,D121,L52,U601,R515,U713,L404,U45,R362,U670,L235,U102,R373,U966,L362,U218,R280,U951,R371,U378,L10,U670,R958,D423,L740,U888,R235,U899,L387,U167,R392,D19,L330,D916,R766,D471,L708,D83,R749,D696,L50,D159,R828,U479,L980,D613,L182,D875,L307,U472,L317,U999,R435,D364,R737,U550,L233,U190,L501,U610,R433,U470,L801,U52,L393,D596,L378,U220,L967,D807,R357,D179,L731,D54,L804,D865,L994,D151,L181,U239,R794,D378,L487,U408,R817,U809,R678,D599,L564,U480,R525,D189,L641,D771,L514,U72,L248,D334,L859,D318,R590,D571,R453,U732,R911,U632,R992,D80,R490,D234,L710,U816,L585,U180,L399,D238,L103,U605,R993,D539,R330'),
                        transform_str('L996,U383,L962,U100,L836,D913,R621,U739,R976,D397,L262,D151,L12,U341,R970,U123,L713,U730,L52,D223,L190,D81,R484,D777,R374,U755,R640,D522,R603,D815,R647,U279,R810,U942,R314,D19,L938,U335,R890,U578,R273,U338,R186,D271,L230,U90,R512,U672,R666,D328,L970,U17,R368,D302,L678,D508,L481,U12,L783,D409,L315,D579,L517,D729,R961,D602,R253,D746,R418,D972,R195,D270,L46,D128,L124,U875,R632,D788,L576,U695,R159,U704,R599,D597,R28,D703,L18,D879,L417,U633,L56,U302,R289,U916,R820,D55,R213,U712,R250,D265,L935,D171,L680,U738,L361,D939,R547,D606,L255,U880,R968,U255,R902,D624,L251,U452,L412,D60,L996,D140,L971,U196,R796,D761,L54,U54,L98,D758,L521,U578,L861,U365,L901,D495,L234,D124,L121,D329,L38,U481,L491,D938,L840,D311,L993,D954,R654,U925,L528,D891,L994,D681,L879,D476,L933,U515,L292,U626,R348,D963,L145,U230,L114,D11,R651,D929,R318,D672,R125,D827,L590,U338,L755,D925,L577,D52,R131,D465,R657,D288,R22,D363,R162,D545,L904,D457,R987,D389,L566,D931,L773,D53,R162,U271,L475,U666,L594,U733,R279,D847,R359,U320,R450,D704,L698,D173,R35,D267,L165,D66,L301,U879,R862,U991,R613,D489,L326,D393,R915,U718,R667,U998,R554,U199,R300,U693,R753,U938,R444,U12,L844,D912,R297,D668,R366,U710,L821,U384,R609,D493,R233,U898,R407,U683,R122,U790,L1,U834,L76,U572,R220,U752,L728,D85,L306,D805,R282,U507,R414,D687,L577,U174,L211,U308,L15,U483,R741,D828,L588,D192,L409,D605,L931,U260,L239,D424,L846,U429,L632,U122,L266,D544,R248,U188,R465,U721,R621,U3,L884,U361,L322,U504,R999,U381,R327,U555,L467,D849,R748,U175,R356')),
                 :expected => 15678 }  
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

include Day3
Day3.test