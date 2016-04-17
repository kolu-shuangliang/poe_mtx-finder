
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
	
	request.open( 'GET', "https://www.pathofexile.com/character-window/get-stash-items?accountName=" + account + "&tabIndex=" + tab + "&league=" + league + "&tabs=0", true );
	
	request.send( null );
}

function stash_callback( data, currentTab ){
	
	var data_json = JSON.parse( data );
	
	console.log( 'selected league have ' + data_json.numTabs + ' tabs.' );
	console.log( 'this is tab nro: ' + currentTab + '.' );
	
	// DO SOME DATA THINGS
	
	// Current stash tab is finished.
	// Search next if there's any more.
	if( currentTab < Number( data_json.numTabs ) ){
		setTimeout( function(){ stash_httpGetAsync( accountName, Number( currentTab ) + 1, selectedLeague, stash_callback ) }, 1000 );
	}
}