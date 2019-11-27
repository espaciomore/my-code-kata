//
// Author:      Manuel A. Cerda R.
//
// Time:        Thu, Nov 26 2019 21:23:00 UTC +03:00
//
// Description: This is part of my studies in the development of 
//              the Evolutionary Architecture or what is also known as the 
//              Artificial Intelligence.
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
  let alpha = Math.log2( Hz / 31 )
  let omega = Math.log2( 19000 / Hz )
  let proton = Math.log2( 19000 / 31 )
  let v1 = f( alpha, proton )
  let v2 = f( proton, omega )

  pv.push( v1, v2 )
  

  return pv
}
// EOF