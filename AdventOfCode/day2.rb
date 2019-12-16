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

  def puzzle
    txt = File.read('day2_puzzle.txt').to_s
    masses = txt.split(",").map { |str| str.to_i }
  end

  def test
    results =[]
      results << { :got => int_code( [1,0,0,0,99] )[0],
                  :expected => 2 }
      results << { :got => int_code( [2,3,0,3,99] )[3],
                  :expected => 6 }
      results << { :got => int_code( [2,4,4,5,99,0] )[5],
                  :expected => 9801 }
      results << { :got => int_code( [1,1,1,4,99,5,6,0,99] )[0],
                  :expected => 30 }
      results << { :got => int_code( puzzle )[0],
                  :expected => 3790689 }            
      results << { :got => find_noun_and_verb( 19690720, puzzle ),
                  :expected => [65, 33] } # 6533

      passed = []; failed = []

      results.each do |result|
        if (result[:got] != result[:expected])
          failed << result
        else
          passed << result
        end
      end

      "#{passed.size} passed\n#{failed.size} failed#{' ' if failed.size > 0}#{failed if failed.size > 0}"
  end
end

# include Day2
# puts Day2.test
# EOF