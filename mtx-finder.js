
/*
get all characters
	https://www.pathofexile.com/character-window/get-characters
	
specific
	https://www.pathofexile.com/character-window/get-items?accountName=account&character=character

stash
	https://www.pathofexile.com/character-window/get-stash-items?accountName=account&tabIndex=1&league=Perandus&tabs=0

*/

// Standard
// Hardcore
// Perandus
// Hardcore%20Perandus
var selectedLeague = 'Perandus';

// Start stash loop
// parameters are ( account name, stash tab index, league, callback )
// account name and league are from user
// stash tab index starts from 0
// stash_callback is function that searches current stash and http request next stash.
stash_httpGetAsync( accountName, 0, selectedLeague, stash_callback );

// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // 
// CHARACTERS
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // //




	
	
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // 
// STASH
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // 
function stash_httpGetAsync( index, callback ){
	var request = new XMLHttpRequest();
	request.onreadystatechange = function(){
		if( request.readyState == 4 && request.status == 200 ){
			callback( request.responseText, index );
		}
	}
	request.open( 'GET', 'https://www.pathofexile.com/character-window/get-stash-items?accountName=' + accountName + '&tabIndex=' + index + '&league=' + selectedLeague + '&tabs=0', true );
	request.send( null );
}

function stash_callback( data, index ){
	// Parse json object from strings
	var data_json = JSON.parse( data );
	
	// Logs stats about this tab
	if( index == 0 ){
		console.log( 'selected ' + selectedLeague + ' league have ' + data_json.numTabs + ' tabs.' );
	}
	console.log( 'this is tab nro: ' + index + ' || items: ' + data_json.items.length   );
	//console.log( data_json );
	
	for( var key in data_json.items ){
		// Make sure this property exists inside data_json.items
		if( data_json.items.hasOwnProperty( key ) ){
			// Check if this item have property cosmeticMods.
			// Items with mtx have this property
			if( data_json.items[ key ].hasOwnProperty( 'cosmeticMods' ) ){
				console.log( 'Found mtx! || ' + data_json.items[ key ][ 'cosmeticMods' ][ 0 ] );
				console.log( '-- In stash nro: '+ index + '.');
				console.log( '-- Item: ' + data_json.items[ key ].name + ' ' + data_json.items[ key ].cosmeticMods[ 0 ] );
				console.log( '-- Position: [ from left: ' + ( Number( data_json.items[ key ].x ) + 1 ) + ' ] || [ from top: ' + ( Number( data_json.items[ key ].y ) + 1 ) + ']' );
				//console.log( data_json.items[ key ] );
			}
			
			// Check gem mtx inside this item
			for( var key2 in data_json.items[ key ][ 'socketedItems' ] ){
				if( data_json.items[ key ][ 'socketedItems' ].hasOwnProperty( key2 ) ){
					if( data_json.items[ key ][ 'socketedItems' ][ key2 ].hasOwnProperty( 'cosmeticMods' ) ){
						console.log( 'Found gem mtx!' || + data_json.items[ key ][ 'socketedItems' ][ key2 ][ 'cosmeticMods' ][ 0 ] );
						console.log( '-- gem: ' + data_json.items[ key ][ 'socketedItems' ][ key2 ].typeLine );
						console.log( '-- In stash nro: '+ index + '.');
						console.log( '-- in Item: ' + data_json.items[ key ].name );
						console.log( '-- Position: [ from left: ' + ( Number( data_json.items[ key ].x ) + 1 ) + ' ] || [ from top: ' + ( Number( data_json.items[ key ].y ) + 1 ) + ']' );
					}
				}
			}
		}
	}
	
	//console.log( data_json );
	
	// Current stash tab is finished.
	// Search next if there's any more.
	if( index < ( Number( data_json.numTabs ) - 1 ) ){
		setTimeout( function(){ stash_httpGetAsync( Number( index ) + 1, stash_callback ) }, 1000);
	}
}