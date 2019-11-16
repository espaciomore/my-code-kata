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
// Tests:       > node ai-research.js test ascii.test.dump
//              [ [ [true/false], '[f( x )] = [expected value]' ] ]
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

  let pv = []
  let space = journey.length
  let neutron = space % 2
  let nucleus = Math.floor( space / 2 )
  let alpha = journey.substr( 0 * space, nucleus + neutron )
  let omega = journey.substr( nucleus, space )

  for ( let ki = 0; ki < nucleus + neutron ; ki++ )
  {
    let x = alpha[ ki ]
    let y = omega[ nucleus + neutron - ki - 1 ]
    let p = f( x, y )

    pv.push( p )
  }

  return pv
}

this.test = ( args ) =>
{
  let output = []
  let dump = args.shift()
  let fs = require('fs')
  let file = fs.readFileSync( dump )
  let data = JSON.parse( file )

  data.forEach( ( record ) =>
  {
    Object.keys( record ).forEach( ( fname ) =>
    {
      Object.keys( record[ fname ] ).forEach( ( arg ) =>
      {
        args.push( arg )

        let results = this.run( fname, args )
        let expected = record[ fname ][ arg ]

        output.push( [ results[0].includes( `[ ${expected} ]` ), results[0] ] )
      })
    })
  })

  return output
}

this.run = ( fname, args ) =>
{
  let output = []

  do
  {
    let f = this[ fname ]
    let x = args.shift()
    let pv = f( x )
    let pv_ = pv.map((v) =>
    {
      return Number(v.toFixed(4))
    })

    output.push( `${fname}( ${x} ) = [ ${pv_} ]` )
  }
  while ( args.length > 0 )

  return output
}

this.args = process.argv.slice(2)
this.fname = this.args.shift()

console.log( this.fname == 'test' ? this.test( this.args ) : this.run( this.fname, this.args ) )


// EOF