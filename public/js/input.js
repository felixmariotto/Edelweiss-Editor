

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
		select-orientation
	*/



	//////////////
	//  DRAWING
	///////////////

	domDrawTile.addEventListener('click', (e)=> {
		domDrawTile.blur();
		setState('select-tile');
		appConsole.log('Select a tile');
	});

	domDrawCube.addEventListener('click', ()=> {
		domDrawCube.blur();
		console.log('draw cube');
	});



	/////////////////
	// DELETION
	////////////////

	domDelTile.addEventListener('click', ()=> {
		domDelTile.blur();
		console.log('delete tile');
	});

	domDelCube.addEventListener('click', ()=> {
		domDelCube.blur();
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

		// console.log(e.code)
		
		switch( e.code ) {

			case 'Escape' :
				setState('idle');
				drawer.unselect();
				atlas.clearTempTiles();
				appConsole.log('Abort all functions');
				break;

			case 'Enter' :
				validate();
				break;

			case 'Space' :
				validate();
				break;

			case 'ArrowLeft' :
				requestDirection( 0 );
				break;

			case 'ArrowUp' :
				requestDirection( 1 );
				break;

			case 'ArrowRight' :
				requestDirection( 2 );
				break;

			case 'ArrowDown' :
				requestDirection( 3 );
				break;

		};

	}, false );



	function requestDirection( int ) {

		if ( state == 'select-edge' ) {

			drawer.highlightEdge( int );

		} else if ( state == 'select-orientation' && int != 3 ) {

			atlas.highlightTile( int );

		};

	};



	function validate() {

		if ( state == 'select-edge' ) {
			drawer.validateEdge();
		};

	};




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