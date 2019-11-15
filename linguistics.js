//
// Author:      Manuel A. Cerda R.
//
// Time:        Thu, Nov 14 2019 21:23:00 UTC +03:00
//
// Description: This is part of my studies in the development of 
//              the Evolutionary Architecture or what is also known as the 
//              Artificial Intelligence.
//
// Type Of:     Linguistic Intelligence
//
//
// License(s):  GPL+3, MIT, Copyright
//
// Language:    Any
//
// Revision:    1.0.0
//
// Location:    
//
// Function:    Palindrome 
//
// Tests:       node linguistics.js palindrome '0123210'
//              => [ 1, 1, 1, 1 ]
//
//              node linguistics.js palindrome '12xy'
//              => [ 0.4049586776859504, 0.4166666666666667 ]
//
//              node linguistics.js palindrome '12#xy'
//              => [ 0.4049586776859504, 0.4166666666666667, 1 ]


this[ 'palindrome' ] = ( photon ) =>
{
  let f = ( x, y ) =>
  {
    let g = ( h, l ) =>
    {
      let highest = h.charCodeAt( 0 )
      let lowest = l.charCodeAt( 0 )

      return lowest / highest
    }

    return x > y ? g( x, y ) : g( y, x )
  }

  let probabilities = []
  let space = photon.length
  let neutron = space % 2
  let chi = Math.floor( space / 2 )
  let yin = photon.substr( 0, chi + neutron )
  let yan = photon.substr( chi, space )

  for ( let ki = 0; ki < chi + neutron ; ki++ )
  {
    let x = yin[ ki ]
    let y = yan[ chi + neutron - ki - 1 ]

    probabilities.push( f( x, y ) )
  }

  return probabilities
}

process.argv.shift()
process.argv.shift()

let f = this[ process.argv.shift() ]

while ( process.argv.length > 0 )
{
  let x = process.argv.shift()
  let y = f( x )

  console.log( y )
}


// EOF