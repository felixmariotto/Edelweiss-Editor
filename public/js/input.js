

function Input() {



	const domDrawTile = document.getElementById('draw-tile');
	const domDrawCube = document.getElementById('draw-cube');

	const domDelTile = document.getElementById('delete-tile');
	const domDelCube = document.getElementById('delete-cube');

	const domExportOBJ = document.getElementById('export-obj');
	const domSaveServer = document.getElementById('save-server');

	var mouse = new THREE.Vector2();
	var rect ;
	var currentPaint ;
	var state = 'idle' ;
	/* LIST OF STATES :
		select-tile
		select-edge
		select-orientation
		delete-tile
		paint
		export-obj
	*/



	/////////////////
	///  TRANSFER
	/////////////////

	domExportOBJ.addEventListener('click', (e)=> {
		importExport.exportSceneOBJ();
		domExportOBJ.blur();
		abortAll();
		setState('export-obj');
		appConsole.log('Choose a path on the system to save a PLY of the scene');
	})




	//////////////
	//  DRAWING
	///////////////

	domDrawTile.addEventListener('click', (e)=> {
		domDrawTile.blur();
		abortAll();
		setState('select-tile');
		appConsole.log('SELECT a tile for DRAWING');
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
		abortAll();
		setState('delete-tile');
		appConsole.log('SELECT a tile to DELETE');
	});

	domDelCube.addEventListener('click', ()=> {
		domDelCube.blur();
		console.log('delete cube');
	});



	//////////////////
	///  PÄINTING
	//////////////////

	function clickPaint( paintName ) {
		setState( 'paint' );
		currentPaint = paintName ;
		appConsole.log( 'SELECT tiles to paint them with ATTRIBUTE : ' + paintName );
	};




	///////////////////////////
	///  CANVAS INTERACTION
	//////////////////////////

	CANVAS.addEventListener( 'mousedown', ()=> {

		rect = CANVAS.getBoundingClientRect();
		
		mouse.x = ( event.clientX / rect.width ) * 2 - 1;
		mouse.y = - ( (event.clientY - rect.top) / rect.height ) * 2 + 1;

		if ( state == 'select-tile' ) {

			drawer.raycast( mouse );

		} else if ( state == 'delete-tile' ) {

			atlas.raycast( mouse, 'delete-tile' );

		} else if ( state == 'paint' ) {

			atlas.raycast( mouse, 'paint', currentPaint );

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
				abortAll();
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

		} else if ( state == 'select-orientation' ) {

			atlas.validateTile();

		};

	};




	////////////////
	///  FUNCTIONS
	////////////////

	function setState( stateString ) {
		state = stateString ;
	};

	function abortAll() {
		drawer.unselect();
		atlas.clearTempTiles();
		appConsole.log('Abort all functions');
	};

	


	return {
		setState,
		clickPaint
	};

};