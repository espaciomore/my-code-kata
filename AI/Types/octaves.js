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
// Location:    https://raw.githubusercontent.com/espaciomore/my-code-kata/master/AI/Types/palindrome.js
//
// Function:    Octaves 
//
// Tests:       > node server.js test freq.test.dump
//              [ [ [true/false], [f( x )] = [expected value] ] ]
//
this.octaves = ( Hz ) =>
{
  return [ Math.log2( Hz / 31 ), Math.log2( 19 * 1000 / Hz ) ]
}
// EOF