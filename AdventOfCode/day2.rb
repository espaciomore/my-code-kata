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
