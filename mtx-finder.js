/*
get all characters
	https://www.pathofexile.com/character-window/get-characters
specific
	https://www.pathofexile.com/character-window/get-items?accountName=account&character=character
stash
	https://www.pathofexile.com/character-window/get-stash-items?accountName=account&tabIndex=1&league=Perandus&tabs=0
*/

var accountName = 'account';
// Standard
// Hardcore
// Perandus
// Hardcore Perandus
var selectedLeague = 'Standard';

var leagueList = [ "Standard", "Hardcore", "Perandus", "Hardcore Perandus" ];

// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // 
// HTML STUFFS
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // //

// Create and adds container to body
var container = document.createElement( 'div' );
// Sets container styles.
container.style.position = 'absolute';
container.style.top = '100px';
container.style.left = ( ( window.innerWidth / 2 ) - 400 ) + 'px';
container.style.width = '800px';
container.style.minHeight = '800px';
container.style.overflow = 'auto';
container.style.backgroundColor = 'white';
container.style.zIndex = '9999';
document.body.appendChild( container );

// Account name elements
var nameContainer = document.createElement( 'div' );
nameContainer.style.width = '100%';
nameContainer.style.height = '50px';
container.appendChild( nameContainer );

var nameSpan = document.createElement( 'span' );
nameSpan.style.width = '20%';
nameSpan.style.cssFloat = 'left';
nameSpan.innerHTML = 'Account Name: ';
nameContainer.appendChild( nameSpan );

var nameInput = document.createElement( 'input' );
nameInput.type = 'text';
nameInput.id = 'mtx-finder-name';
nameInput.style.width = '70%';
nameInput.style.cssFloat = 'right';
nameContainer.appendChild( nameInput );

// League elements
var leagueContainer = document.createElement( 'div' );
leagueContainer.style.width = '100%';
leagueContainer.style.height = '50px';	
container.appendChild( leagueContainer );

var leagueSpan = document.createElement( 'span' );
leagueSpan.style.width = '20%';
leagueSpan.style.cssFloat = 'left';
leagueSpan.innerHTML = 'Select League: ';
leagueContainer.appendChild( leagueSpan );

var leagueSelector =  document.createElement( 'select' );
leagueSelector.id = 'mtx-finder-league';
leagueSelector.style.width = '70%';
leagueSelector.style.cssFloat = 'right';
leagueContainer.appendChild( leagueSelector );

for( var x = 0; x < leagueList.length; x++ ){
	var tempElement = document.createElement( 'option' );
	tempElement.value = leagueList[ x ];
	tempElement.text = leagueList[ x ];
	leagueSelector.appendChild( tempElement );
}

// Button to start searching
var searchButton = document.createElement( 'button' );
searchButton.style.width = '100%';
searchButton.style.height = '25px';
searchButton.innerHTML = 'Search';
container.appendChild( searchButton );

// result list
var resultList = document.createElement( 'div' );
resultList.style.width = '100%';
resultList.style.minHeight = '20px';
resultList.style.overflow = 'auto';
resultList.id = 'mtx-finder-result';
container.appendChild( resultList );

//button eventlistener
searchButton.addEventListener( 'click', function(){
	console.log( 'start searching!' );
	
	var tempDiv = document.createElement( 'div' );
	tempDiv.style.width = '100%';
	tempDiv.style.height = '25px';
	tempDiv.style.textAlign = 'center';
	tempDiv.style.fontSize = '24px';
	tempDiv.innerHTML = 'Search Started!';
	resultList.appendChild( tempDiv );
	
	accountName = document.getElementById( 'mtx-finder-name' ).value;
	selectedLeague = document.getElementById( 'mtx-finder-league' ).value;
	
	setTimeout( function(){ char_list_httpGetAsync( char_list_callback ) }, 1000);
}, false );




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
				
				// console.log( 'Found mtx! || ' + character.items[ key ][ 'cosmeticMods' ][ 0 ] );
				// console.log( '-- character: ' + character.character.name + ' || league: ' + character.character.league );
				// console.log( '-- item: ' + character.items[ key ].name );
				// console.log( '-- location:' + character.items[ key ].inventoryId );
				
				var tempDiv = document.createElement( 'div' );
				tempDiv.style.width = '100%';
				tempDiv.style.minHeight = '50px';
				tempDiv.style.overflow = 'auto';
				tempDiv.style.borderBottom = '1px solid black';
				tempDiv.innerHTML = 'Found mtx [ ' + character.items[ key ][ 'cosmeticMods' ][ 0 ] + '<br />';
				tempDiv.innerHTML += '-- character: ' + character.character.name + ' || league: ' + character.character.league + '<br />';
				tempDiv.innerHTML += '-- item: ' + character.items[ key ].name + '<br />';
				tempDiv.innerHTML += '-- location: ' + character.items[ key ].inventoryId + '<br />';
				document.getElementById( 'mtx-finder-result' ).appendChild( tempDiv );
			}
			
			// Check gem mtx inside this item
			for( var key2 in character.items[ key ][ 'socketedItems' ] ){
				if( character.items[ key ][ 'socketedItems' ].hasOwnProperty( key2 ) ){
					if( character.items[ key ][ 'socketedItems' ][ key2 ].hasOwnProperty( 'cosmeticMods' ) ){
						
						// console.log( 'Found gem mtx!' || + character.items[ key ][ 'socketedItems' ][ key2 ][ 'cosmeticMods' ][ 0 ] );
						// console.log( '-- character: ' + character.character.name + ' || league: ' + character.character.league );
						// console.log( '-- gem: ' + character.items[ key ][ 'socketedItems' ][ key2 ].typeLine );
						// console.log( '-- in item: ' + character.items[ key ].name );
						// console.log( '-- location:' + character.items[ key ].inventoryId );
						
						var tempDiv = document.createElement( 'div' );
						tempDiv.style.width = '100%';
						tempDiv.style.minHeight = '50px';
						tempDiv.style.overflow = 'auto';
						tempDiv.style.borderBottom = '1px solid black';
						tempDiv.innerHTML = 'Found gem mtx!' || + character.items[ key ][ 'socketedItems' ][ key2 ][ 'cosmeticMods' ][ 0 ] + '<br />';
						tempDiv.innerHTML += '-- character: ' + character.character.name + ' || league: ' + character.character.league + '<br />';
						tempDiv.innerHTML += '-- gem: ' + character.items[ key ][ 'socketedItems' ][ key2 ].typeLine + '<br />';
						tempDiv.innerHTML += '-- in item: ' + character.items[ key ].name + '<br />';
						tempDiv.innerHTML += '-- location: ' + character.items[ key ].inventoryId + '<br />';
						document.getElementById( 'mtx-finder-result' ).appendChild( tempDiv );
						
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
				
				// console.log( 'Found mtx! || ' + data_json.items[ key ][ 'cosmeticMods' ][ 0 ] );
				// console.log( '-- In stash nro: '+ index + '.');
				// console.log( '-- Item: ' + data_json.items[ key ].name + ' ' + data_json.items[ key ].cosmeticMods[ 0 ] );
				// console.log( '-- Position: [ from left: ' + ( Number( data_json.items[ key ].x ) + 1 ) + ' ] || [ from top: ' + ( Number( data_json.items[ key ].y ) + 1 ) + ']' );
				
				var tempDiv = document.createElement( 'div' );
				tempDiv.style.width = '100%';
				tempDiv.style.minHeight = '50px';
				tempDiv.style.overflow = 'auto';
				tempDiv.style.borderBottom = '1px solid black';
				tempDiv.innerHTML = 'Found mtx [ ' + data_json.items[ key ][ 'cosmeticMods' ][ 0 ] + '<br />';
				tempDiv.innerHTML += '-- In stash nro: '+ index + '<br />';
				tempDiv.innerHTML += '-- Item: ' + data_json.items[ key ].name + ' ' + data_json.items[ key ].cosmeticMods[ 0 ] + '<br />';
				tempDiv.innerHTML += '-- Position: [ from left: ' + ( Number( data_json.items[ key ].x ) + 1 ) + ' ] || [ from top: ' + ( Number( data_json.items[ key ].y ) + 1 ) + ']<br />';
				document.getElementById( 'mtx-finder-result' ).appendChild( tempDiv );
				
			}
			
			// Check gem mtx inside this item
			for( var key2 in data_json.items[ key ][ 'socketedItems' ] ){
				if( data_json.items[ key ][ 'socketedItems' ].hasOwnProperty( key2 ) ){
					if( data_json.items[ key ][ 'socketedItems' ][ key2 ].hasOwnProperty( 'cosmeticMods' ) ){
						
						// console.log( 'Found gem mtx!' || + data_json.items[ key ][ 'socketedItems' ][ key2 ][ 'cosmeticMods' ][ 0 ] );
						// console.log( '-- gem: ' + data_json.items[ key ][ 'socketedItems' ][ key2 ].typeLine );
						// console.log( '-- In stash nro: '+ index + '.');
						// console.log( '-- in Item: ' + data_json.items[ key ].name );
						// console.log( '-- Position: [ from left: ' + ( Number( data_json.items[ key ].x ) + 1 ) + ' ] || [ from top: ' + ( Number( data_json.items[ key ].y ) + 1 ) + ']' );
						
						var tempDiv = document.createElement( 'div' );
						tempDiv.style.width = '100%';
						tempDiv.style.minHeight = '50px';
						tempDiv.style.overflow = 'auto';
						tempDiv.style.borderBottom = '1px solid black';
						tempDiv.innerHTML = 'Found gem mtx!' || + data_json.items[ key ][ 'socketedItems' ][ key2 ][ 'cosmeticMods' ][ 0 ] + '<br />';
						tempDiv.innerHTML += '-- gem: ' + data_json.items[ key ][ 'socketedItems' ][ key2 ].typeLine + '<br />';
						tempDiv.innerHTML += '-- In stash nro: '+ index + '<br />';
						tempDiv.innerHTML += '-- in item: ' + data_json.items[ key ].name + '<br />';
						tempDiv.innerHTML += '-- Position: [ from left: ' + ( Number( data_json.items[ key ].x ) + 1 ) + ' ] || [ from top: ' + ( Number( data_json.items[ key ].y ) + 1 ) + ']<br />';
						document.getElementById( 'mtx-finder-result' ).appendChild( tempDiv );
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