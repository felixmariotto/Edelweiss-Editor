

function Input() {



	const domDrawTile = document.getElementById('draw-tile');
	const domDrawCube = document.getElementById('draw-cube');

	const domDelTile = document.getElementById('delete-tile');
	const domDelCube = document.getElementById('delete-cube');


	var mouse = new THREE.Vector2();
	var rect ;
	var state = 'idle' ;
	/* LIST OF STATES :
		select-tile
		select-edge
	*/



	//////////////
	//  DRAWING
	///////////////

	domDrawTile.addEventListener('click', ()=> {
		setState('select-tile');
		appConsole.log('Select a tile');
	});

	domDrawCube.addEventListener('click', ()=> {
		console.log('draw cube');
	});



	/////////////////
	// DELETION
	////////////////

	domDelTile.addEventListener('click', ()=> {
		console.log('delete tile');
	});

	domDelCube.addEventListener('click', ()=> {
		console.log('delete cube');
	});




	///////////////////////////
	///  CANVAS INTERACTION
	//////////////////////////

	CANVAS.addEventListener( 'mousedown', ()=> {

		rect = CANVAS.getBoundingClientRect();
		
		mouse.x = ( event.clientX / rect.width ) * 2 - 1;
		mouse.y = - ( (event.clientY - rect.top) / rect.height ) * 2 + 1;

		if ( state == 'select-tile' ) {
			drawer.raycast( mouse );
		};

	}, false );
	




	////////////////////////////
	///	 KEYBOARD INTERACTION
	////////////////////////////

	document.addEventListener( 'keydown', (e)=> {
		
		switch( e.code ) {

			case 'Escape' :
				setState('idle');
				drawer.unselect();
				appConsole.log('Abort all functions');
				break;

		};

	}, false );





	////////////////
	///  FUNCTIONS
	////////////////

	function setState( stateString ) {
		state = stateString ;
	};


	return {
		setState
	};

};