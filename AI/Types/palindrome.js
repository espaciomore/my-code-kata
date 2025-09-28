//
// Author:      Manuel A. Cerda R.
//
// Time:        Thu, Nov 14 2019 21:23:00 UTC +03:00
//
// Description: Palindrome analysis function.
//
// Type Of:     Linguistic, Spatial and Logical-Mathematical Intelligence
//
// License(s):  GPL+3, MIT, Copyright
//
// Engine:      NodeJS v.9.2.0
//
// Revision:    1.0.0
//
// Location:    https://raw.githubusercontent.com/espaciomore/my-code-kata/master/AI/Types/palindrome.js
//
// Function:    Palindrome 
//
// Tests:       > node server.js test ascii.test.dump
//              [ [ [true/false], [f( x )] = [expected value] ] ]
//
// Data Schema: [{"(string) fname":{"(string) arg":[(double) expected-pv...]}}]
//
this.palindrome = ( journey ) =>
{
  let f = ( x, y ) =>
  {
    let d = ( h, l ) =>
    {
      let yin = h.charCodeAt( 0 )
      let yan = l.charCodeAt( 0 )
      
      return ( yin - yan ) / yin
    }

    return x > y ? d( x, y ) : d( y, x )
  }

  let pv = [] // The probability of equality vector
  let space = journey.length
  let neutron = space % 2
  let nucleus = Math.floor( space / 2 )
  let alpha = journey.substr( 0 * space, nucleus + neutron ) // A.K.A. The Yin
  let omega = journey.substr( nucleus, space ) // The Yan

  for ( let ki = 0; ki < nucleus + neutron ; ki++ )
  {
    let x = alpha[ ki ]
    let y = omega[ nucleus + neutron - ki - 1 ]
    let p = f( x, y )

    pv.push( p )
  }

  return pv
}
// EOF