
/*
get all characters
	https://www.pathofexile.com/character-window/get-characters
	
specific
	https://www.pathofexile.com/character-window/get-items?accountName=account&character=character

stash
	https://www.pathofexile.com/character-window/get-stash-items?accountName=account&tabIndex=1&league=Perandus&tabs=0

*/

var accountName = 'account';
var selectedLeague = 'Perandus';

// Start stash loop
// parameters are ( account name, stash tab index, league, callback )
// account name and league are from user
// stash tab index starts from 0
// stash_callback is function that searches current stash and http request next stash.
stash_httpGetAsync( accountName, 0, selectedLeague, stash_callback );

function stash_httpGetAsync( account, tab, league, callback ){
	
	var request = new XMLHttpRequest();
	
	request.onreadystatechange = function(){
		
		if( request.readyState == 4 && request.status == 200 ){
			callback( request.responseText, tab );
		}
		
	}
	
	request.open( 'GET', 'https://www.pathofexile.com/character-window/get-stash-items?accountName=' + account + '&tabIndex=' + tab + '&league=' + league + '&tabs=0', true );
	
	request.send( null );
}

function stash_callback( data, currentTab ){
	
	// Parse json object from strings
	var data_json = JSON.parse( data );
	
	// Logs stats about this tab
	if( currentTab == 0 ){
		console.log( 'selected ' + selectedLeague + ' league have ' + data_json.numTabs + ' tabs.' );
	}
	console.log( 'this is tab nro: ' + currentTab + ' || items: ' + data_json.items.length   );
	//console.log( data_json );
	
	for( var key in data_json.items ){
		// Make sure this property exists inside data_json.items
		if( data_json.items.hasOwnProperty( key ) ){
			// Check if this item have property cosmeticMods.
			// Items with mtx have this property
			if( data_json.items[ key ].hasOwnProperty( 'cosmeticMods' ) ){
				console.log( 'Found mtx!' );
				console.log( '-- In stash nro: '+ currentTab + '.');
				console.log( '-- Item: ' + data_json.items[ key ].name + ' ' + data_json.items[ key ].cosmeticMods[ 0 ] );
				console.log( '-- Position: [ from left: ' + ( Number( data_json.items[ key ].x ) + 1 ) + ' ] || [ from top: ' + ( Number( data_json.items[ key ].y ) + 1 ) + ']' );
				//console.log( data_json.items[ key ] );
			}
		}
	}
	
	//console.log( data_json );
	
	// DO SOME DATA THINGS
	
	// Current stash tab is finished.
	// Search next if there's any more.
	if( currentTab < ( Number( data_json.numTabs ) - 1 ) ){
	// limit stash tabs for now.
	//if( currentTab < Number( data_json.numTabs ) && currentTab < 5 ){
		setTimeout( function(){ stash_httpGetAsync( accountName, Number( currentTab ) + 1, selectedLeague, stash_callback ) }, 1000 );
	}
}