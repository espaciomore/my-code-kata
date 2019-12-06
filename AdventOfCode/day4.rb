module Day4

	def is_valid_password_in_range(p, r)
		return false unless p >= r.first
		return false unless p <= r.first
		return true
	end

	def is_valid_range(r)
		return false unless r.first.to_s.match /^\d{6}$/
		return false unless r.last.to_s.match /^\d{6}$/
		return true
	end	

	def is_valid_password(p)
		return false unless p.to_s.match /^[1-9]{6}$/
		return false unless p.to_s.match /(1{2,}|2{2,}|3{2,}|4{2,}|5{2,}|6{2,}|7{2,}|8{2,}|9{2,})/
		return false unless p.to_s.match /^1*2*3*4*5*6*7*8*9*$/
		return true
	end

	def find_valid_passwords_in_range(r)
		return false unless is_valid_range r
		passwords = []
		r.step(1) do |p|
			passwords << p if is_valid_password p
		end	
		passwords	
	end	

	def count_valid_passwords_in_range(r)
		find_valid_passwords_in_range( r ).size
	end
		
	def test
		results =[]
	    results << { :got => is_valid_password( '111111' ),
	                 :expected => true }
	    results << { :got => is_valid_password( '223450' ),
	                 :expected => false }
	    results << { :got => is_valid_password( '123789' ),
	                 :expected => false }
	    results << { :got => is_valid_password( '012345' ),
	                 :expected => false }
	    results << { :got => is_valid_password( '234566' ),
	                 :expected => true }  
	    results << { :got => is_valid_password( '224433' ),
	                 :expected => false }            
	    results << { :got => count_valid_passwords_in_range( 307237..769058 ),
	                 :expected => 889 }             

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

include Day4
Day4.test
# EOF