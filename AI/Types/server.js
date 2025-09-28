//
// Author:      Manuel A. Cerda R.
//
// Time:        Thu, Nov 14 2019 21:23:00 UTC +03:00
//
// Description: This is part of my studies in the development of 
//              the Evolutionary Architecture or what will also known as the 
//              Artificial Intelligence right after machine learning.
//
//              The begining and end of any verse is subject to an expansion mechanism,
//              having symetrical shapes with probabilities of each opposite element to equal each other.
//              This design woudl create a perfect balance, therefore the expansion and not a collapse.
//
//              Analogically, we can imagine that the universe creates palindromes.
//              In atoms, the vibration frequencies of its electrons would create perfect octaves.
//
// License(s):  GPL+3, MIT, Copyright
//
// Engine:      NodeJS v9.2.0
//
// Revision:    1.0.0
//
// Location:    https://raw.githubusercontent.com/espaciomore/my-code-kata/master/AI/Types/server.js
//
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
      Object.keys( record [ fname ] ).forEach( ( arg ) =>
      {
        args.push( arg )

        let results = this.run( fname, args )
        let got = `${results[0][ fname ][ arg ]}` // Computed probalility vector
        let expected = `${record[ fname ][ arg ]}`  // Expected probability vector

        output.push( [ got == expected, results.shift() ] )
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
    const _this = require(`./${fname}`)
    let f = _this[ fname ]
    let x = args.shift()
    let pv = f( x )
    let pv_ = pv.map( ( v ) =>
    {
      return Number( v.toFixed(  this.precision ) )
    })

    let y = {
      [ fname ] : {
        [ x ] : pv_
      }
    }    

    output.push( y )
  }
  while ( args.length > 0 )

  return output
}

this.precision = process.PRECISION || 4
this.args = process.argv.slice( 2 )
this.fname = this.args.shift()

console.log( 
  this.fname == 'test' ? 
  JSON.stringify( this.test( this.args ) ) : 
  JSON.stringify( this.run( this.fname, this.args ) )
)
// EOF