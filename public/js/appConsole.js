

function AppConsole() {

	const domConsole = document.getElementById('console');

	log('Welcome in Edelweiss Engine');
	log('Start by drawing some tiles');

	function log( string ) {

		let log = document.createElement('P');
		log.classList.add('log');
		log.innerHTML = string ;

		domConsole.prepend( log );

	};


	return {
		log
	};

};