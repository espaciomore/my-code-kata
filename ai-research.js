//
// Author:      Manuel A. Cerda R.
//
// Time:        Thu, Nov 14 2019 21:23:00 UTC +03:00
//
// Description: This is part of my studies in the development of 
//              the Evolutionary Architecture or what is also known as the 
//              Artificial Intelligence.
//
// Type Of:     Linguistic, Spatial and Logical-Mathematical Intelligence
//
//
// License(s):  GPL+3, MIT, Copyright
//
// Language:    Any
//
// Revision:    1.0.0
//
// Location:    https://raw.githubusercontent.com/espaciomore/my-code-kata/master/ai-research.js
//
// Function:    Palindrome 
//
// Tests:       > node ai-research.js palindrome
//              palindrome( 0123210 ) = [ 0,0,0,0 ]
//              palindrome( aΦ.Θb ) = [ 0.01020408163265306,0.014989293361884369,0 ]
//              palindrome( aΦbΘ ) = [ 0.8945652173913043,0.8950749464668094 ]
//


this[ 'palindrome' ] = ( journey ) =>
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

  let pv = []
  let space = journey.length
  let neutron = space % 2
  let photon = Math.floor( space / 2 )
  let alfa = journey.substr( 0, photon + neutron )
  let omega = journey.substr( photon, space )

  for ( let ki = 0; ki < photon + neutron ; ki++ )
  {
    let x = alfa[ ki ]
    let y = omega[ photon + neutron - ki - 1 ]

    pv.push( f( x, y ) )
  }

  return probabilities
}

process.argv.shift()
process.argv.shift()

let _ = process.argv.shift()
let f = this[ _ ]
let tests = [ '0123210', 'aΦ.Θb', 'aΦbΘ' ]

if ( !process.argv.length )
{
  tests.forEach( ( test ) =>
  {
    process.argv.push( test )
  })
}

while ( process.argv.length > 0 )
{
  let x = process.argv.shift()
  let pv = f( x )

  console.log( `${_}( ${x} ) = [ ${pv} ]` )
}


// EOF