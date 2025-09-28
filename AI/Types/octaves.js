//
// Author:      Manuel A. Cerda R.
//
// Time:        Thu, Nov 26 2019 21:23:00 UTC +03:00
//
// Description: Octave analysis function.
//
// Type Of:     Musical, Spatial and Logical-Mathematical Intelligence
//
// License(s):  GPL+3, MIT, Copyright
//
// Engine:      NodeJS v.9.2.0
//
// Revision:    1.0.0
//
// Location:    https://raw.githubusercontent.com/espaciomore/my-code-kata/master/AI/Types/octaves.js
//
// Function:    Octaves 
//
// Tests:       > node server.js test freq.test.dump
//              [ [ [true/false], [f( x )] = [expected value] ] ]
//
this.octaves = ( Hz ) =>
{
  let f = ( x, y ) => 
  {
    let d = ( h, l ) =>
    {
      let yin = h
      let yan = l

      return ( yin - yan ) / yin
    }

    return x > y ? d( x, y ) : d( y, x )
  }
  
  let pv = []
  let lower = Hz > 19000 ? 0 : Math.log2( 19000 / Hz )
  let hertz = Math.log2( 19000 / 31 )
  let higher = Hz < 31 ? 0 : Math.log2( Hz / 31 )
  let v1 = f( lower, hertz )
  let v2 = f( higher, hertz )

  pv.push( v1, v2 )

  return pv
}
// EOF