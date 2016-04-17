
/*
get all characters
	https://www.pathofexile.com/character-window/get-characters
	
specific
	https://www.pathofexile.com/character-window/get-items?accountName=account&character=sfdajkj

	
httpGetAsync(
	"https://www.pathofexile.com/character-window/get-stash-items?accountName=account&tabIndex=1&league=Perandus&tabs=0",
	stashCallback
);
*/

var accountName = 'account';
var selectedLeague = 'Perandus';
var totalTabs = 0;


setTimeout( httpGetAsync( accountName, 1, selectedLeague, initCallback ), 1000 );


function httpGetAsync( account, tab, league, callback ){
	
	var request = new XMLHttpRequest();
	
	request.onreadystatechange = function(){
		
		if( request.readyState == 4 && request.status == 200 ){
			callback( request.responseText );
		}
		
	}
	
	request.open( 'GET', "https://www.pathofexile.com/character-window/get-stash-items?accountName=" + account + "&tabIndex=" + tab + "&league=" + league + "&tabs=0", true );
	
	request.send( null );
}

function initCallback( data ){
	
	var data_json = JSON.parse( data );
	
	totalTabs = data_json.numTabs
	
	console.log( 'selected league have ' + data_json.numTabs + ' tabs.' );
}

function stashCallback( data ){
	
	console.log( data );
	
}