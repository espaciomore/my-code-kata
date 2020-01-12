module Day4

  def rule_1(password)
    password.is_a?(Numeric) && password < 1000000
  end

  def rule_2(password, min = password, max = min)
    min <= password && password <= max
  end

  def rule_3(password)
    digit = password.to_s.rjust(6, "0").split("").map {|c| c.to_i}
    adjacent_digits = false
    digit.each_cons(2) do |a, b|
      if a == b
        adjacent_digits = true
      end
    end
    adjacent_digits
  end

  def rule_4(password)
    digit = password.to_s.rjust(6, "0").split("").map {|c| c.to_i}
    increasing_digits = true
    digit.each_cons(2) do |a, b|
      if a > b
        increasing_digits = false
      end
    end
    increasing_digits
  end

  def rule_5(password)
    digit = password.to_s.rjust(6, "0").split("").map {|c| c.to_i}
    groups = []
    count = {}
    digit.each_cons(2) do |a, b|
      if a == b
        groups << a unless groups.include?(a)
        count[a.to_s] = count.has_key?(a.to_s) ? count[a.to_s] + 1 : 1
      end
    end
    groups.any? {|d| count[d.to_s] == 1}
  end

  def valid?(password)
    rule_1(password.to_i) && rule_3(password.to_i) && rule_4(password.to_i) && rule_5(password.to_i)
  end

  def find_valid_passwords_in(range)
    passwords = []
    range.step(1) do |password|
      passwords << password if valid? password
    end
    passwords
  end

  def count_valid_passwords_in(range)
    find_valid_passwords_in(range).size
  end

  def test
    results = []
    results << {:got => valid?('111111'),
                :expected => false}
    results << {:got => valid?('990099'),
                :expected => false}
    results << {:got => valid?('122345'),
                :expected => true}
    results << {:got => valid?('223450'),
                :expected => false}
    results << {:got => valid?('123879'),
                :expected => false}
    results << {:got => valid?('012345'),
                :expected => false}
    results << {:got => valid?('234566'),
                :expected => true}
    results << {:got => valid?('224433'),
                :expected => false}
    results << {:got => valid?('111233'),
                :expected => true}
    results << {:got => valid?('111122'),
                :expected => true}
    results << {:got => valid?('112233'),
                :expected => true}
    results << {:got => valid?('122222'),
                :expected => false}
    results << {:got => valid?('688889'),
                :expected => false}
    results << {:got => valid?('677789'),
                :expected => false}
    results << {:got => valid?('123444'),
                :expected => false}
    results << {:got => valid?('122344'),
                :expected => true}
    results << {:got => valid?('699999'),
                :expected => false}
    results << {:got => count_valid_passwords_in((307237..769058)),
                :expected => 589} # 889 589

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

# include Day4
# puts Day4.test
# EOF