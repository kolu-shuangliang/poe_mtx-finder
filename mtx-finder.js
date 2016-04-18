
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
// Hardcore Perandus
var selectedLeague = 'Perandus';

// start from character. Last character callback will start stash search
setTimeout( function(){ char_list_httpGetAsync( char_list_callback ) }, 1000);

// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // 
// CHARACTERS
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // //
function char_list_httpGetAsync( callback ){
	var request = new XMLHttpRequest();
	request.onreadystatechange = function(){
		if( request.readyState == 4 && request.status == 200 ){
			callback( request.responseText );
		}
	}
	request.open( 'GET', 'https://www.pathofexile.com/character-window/get-characters', true );
	request.send( null );
}

function char_list_callback( data ){
	var charList = JSON.parse( data );
	
	//console.log( charList );
	// Search list for seraching
	// Easier to timeout when callback calls next character
	var searchList = [];

	// Loops through all characters and adds characts in selectedLeague to searchList
	for( var key in charList ){
		// Make sure this property exists inside charList
		if( charList.hasOwnProperty( key ) ){
			//console.log( "name: " + charList[ key ].name + " || league: " + charList[ key ].league );
			// Does mtx search only if characters is from selectedLeague
			if( charList[ key ][ 'league' ].localeCompare( selectedLeague ) == 0 ){
				searchList.push( charList[ key ].name );
			}
		}
	}

	// Start character search loop
		// Next character request is done during callback function
		// this way it will wait x seconds between http requests
	setTimeout( function(){ character_httpGetAsync( searchList, 0, character_callback ) }, 1000);
}

function character_httpGetAsync( searchList, index, callback ){
	var request = new XMLHttpRequest();
	request.onreadystatechange = function(){
		if( request.readyState == 4 && request.status == 200 ){
			callback( request.responseText, searchList, index );
		}
	}
	request.open( 'GET', 'https://www.pathofexile.com/character-window/get-items?accountName=' + accountName + '&character=' + searchList[ index ], true );
	request.send( null );
}

function character_callback( data, searchList, index ){
	var character = JSON.parse( data );
	
	//console.log( 'index: ' + index + ' || name:'  + character.character.name + ' || league: ' + character.character.league );
	//console.log( character );
	
	// CHECK FOR MTX
	for( var key in character.items ){
		// Make sure this property exists inside character.items
		if( character.items.hasOwnProperty( key ) ){
			// Check if this item have property cosmeticMods.
			// Items with mtx have this property
			if( character.items[ key ].hasOwnProperty( 'cosmeticMods' ) ){
				console.log( 'Found mtx! || ' + character.items[ key ][ 'cosmeticMods' ][ 0 ] );
				console.log( '-- character: ' + character.character.name + ' || league: ' + character.character.league );
				console.log( '-- item: ' + character.items[ key ].name );
				console.log( '-- location:' + character.items[ key ].inventoryId );
			}
			
			// Check gem mtx inside this item
			for( var key2 in character.items[ key ][ 'socketedItems' ] ){
				if( character.items[ key ][ 'socketedItems' ].hasOwnProperty( key2 ) ){
					if( character.items[ key ][ 'socketedItems' ][ key2 ].hasOwnProperty( 'cosmeticMods' ) ){
						console.log( 'Found gem mtx!' || + character.items[ key ][ 'socketedItems' ][ key2 ][ 'cosmeticMods' ][ 0 ] );
						console.log( '-- character: ' + character.character.name + ' || league: ' + character.character.league );
						console.log( '-- gem: ' + character.items[ key ][ 'socketedItems' ][ key2 ].typeLine );
						console.log( '-- in item: ' + character.items[ key ].name );
						console.log( '-- location:' + character.items[ key ].inventoryId );
					}
				}
			}
		}
	}
	
	// Starts stash search at end of last character search
	if( ( index + 1 ) < searchList.length ){
		setTimeout( function(){ character_httpGetAsync( searchList, Number( index ) + 1, character_callback ) }, 1000);
	}
	else{
		console.log( 'STARTING STASH' );
		setTimeout( function(){ stash_httpGetAsync( 0, stash_callback ) }, 1000);
	}
}

	
	
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