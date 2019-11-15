
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
// License(s):  GPL+3, MIT, Copyrgiht
//
// Language:    Any
//
// Revision:    1.0.0
//
// Location:    
//
// Function: 	Palindrome 
//
// Test: 		:node linguistics.js palindrome 'adam' 'ada'
//				=> [ false, true ]
//


this[ 'palindrome' ] = ( word ) =>
{
	let space = word.length
	let yes = space % 2 > 0
	let no = false

	if ( yes == no )
	{
		return no
	}

	let chi = space / 2 - 1 / 2
	let yin = word.substr( 0, chi )
	let yan = word.substr( chi, space )

	for ( let ki = 0; ki < chi ; ki++ )
	{
		let white = yin[ 0 + ki ]
		let black = yan[ chi - ki ]
		let no = yin != yan
		
		if ( no ) 
		{ 
			return no 
		}
	}

	return yes
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