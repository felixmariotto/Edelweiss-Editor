

function Input() {



	const domDrawTile = document.getElementById('draw-tile');
	const domDrawCube = document.getElementById('draw-cube');

	const domDelTile = document.getElementById('delete-tile');
	const domDelCube = document.getElementById('delete-cube');

	const domMoveCube = document.getElementById('move-cube');

	const domShowPlanes = document.getElementById('show-planes');
	const domMovePlanes = document.getElementById('move-planes');

	const domFilterTag = document.getElementById('filter-tagged');
	const domShowTag = document.getElementById('show-tag');
	const domAssignTag = document.getElementById('assign-tag');
	const domDeleteTag = document.getElementById('delete-tag');

	const domExportGLTF = document.getElementById('export-gltf');
	const domExportJSON = document.getElementById('export-json');
	const domOpenJSON = document.getElementById('open-json');

	
	const domGeneralInputContainer = document.getElementById('general-input-container');
	const domGeneralInputField = document.getElementById('general-input-field');


	var mouse = new THREE.Vector2();
	var rect ;
	var currentElement ;
	var currentPaint ;


	var transformControl = new THREE.TransformControls( camera, renderer.domElement );
	scene.add( transformControl );

	transformControl.addEventListener( 'dragging-changed', function ( event ) {
		controls.enabled = ! event.value;
	});



	var state = 'idle' ;

	/* LIST OF STATES :

		select-tile
		select-edge
		select-orientation
		delete-tile

		paint

		select-plane
		move-plane

		export-obj
		export-json
		open-json

		show-tag
		assign-tag
		delete-tag

		draw-cube
		delete-cube
		select-cube
		move-cube
	*/



	/////////////////
	///  TRANSFER
	/////////////////

	domExportGLTF.addEventListener('click', (e)=> {
		importExport.exportSceneGLTF();
		domExportGLTF.blur();
		abortAll();
		setState('export-obj');
		appConsole.log('Saving of tiles MESHES as an OBJ model');
	});


	domExportJSON.addEventListener('click', (e)=> {
		importExport.exportLogicJSON();
		domExportJSON.blur();
		abortAll();
		setState('export-json');
		appConsole.log('Saving of tiles LOGIC as an JSON file');
	});


	domOpenJSON.addEventListener('click', (e)=> {
		domOpenJSON.blur();
		abortAll();
		setState('open-json');
		appConsole.log('Choose a JSON scene in your disk to OPEN it')
	});


    domOpenJSON.onchange = importExport.openSceneJSON;





	/////////////
	///  PLANES
	///////////////

	domShowPlanes.addEventListener('click', ()=> {
		domShowPlanes.blur();
		atlas.showPlanes();
	});

	domMovePlanes.addEventListener('click', ()=> {
		domMovePlanes.blur();
		abortAll();
		setState('select-plane');
		appConsole.log('SELECT a PLANE to MOVE');
	});

	function movePlane( planeMesh ) {
		setState('move-plane');
		appConsole.log('press ARROWS to MOVE the PLANE');
	};


	





	//////////////
	//  TILES
	///////////////

	domDelTile.addEventListener('click', ()=> {
		domDelTile.blur();
		abortAll();
		setState('delete-tile');
		appConsole.log('SELECT a tile to DELETE');
	});

	domDrawTile.addEventListener('click', (e)=> {
		domDrawTile.blur();
		abortAll();
		setState('select-tile');
		appConsole.log('SELECT a tile for DRAWING');
	});






	/////////////////
	// 	 CUBES
	////////////////

	domDrawCube.addEventListener('click', ()=> {
		domDrawCube.blur();
		abortAll();
		setState('draw-cube');
		appConsole.log('CLICK to position a new CUBE');
	});

	domDelCube.addEventListener('click', ()=> {
		domDelCube.blur();
		abortAll();
		setState('delete-cube');
		appConsole.log('CLICK on a CUBE to DELETE it');
	});

	domMoveCube.addEventListener('click', (e)=> {
		domMoveCube.blur();
		abortAll();
		setState('select-cube');
		appConsole.log('SELECT a CUBE to MOVE it');
	});


	function moveCube( meshCube ) {
		setState('move-cube');
		appConsole.log('DRAG cube in the scene. SPACE => switch transform');
		transformControl.attach( meshCube );
	};






	//////////////////
	///  PÄINTING
	//////////////////

	function clickPaint( paintName ) {
		setState( 'paint' );
		currentPaint = paintName ;
		appConsole.log( 'SELECT tiles to paint them with ATTRIBUTE : ' + paintName );
	};





	///////////////
	///	  TAGS
	///////////////

	domFilterTag.addEventListener('click', ()=> {
		domFilterTag.blur();
		atlas.filterTaggedElements();
	});

	domShowTag.addEventListener('click', ()=> {
		domShowTag.blur();
		setState('show-tag');
		appConsole.log('SELECT an ELEMENT to show its tag');
	});

	domAssignTag.addEventListener('click', ()=> {
		domAssignTag.blur();
		setState('assign-tag');
		appConsole.log('SELECT an ELEMENT to ASSIGN a new TAG to it');
	});

	domDeleteTag.addEventListener('click', ()=> {
		domDeleteTag.blur();
		setState('delete-tag');
		appConsole.log('SELECT an ELEMENT to REMOVE any TAG from it');
	});





	///////////////////////////
	///  CANVAS INTERACTION
	//////////////////////////

	CANVAS.addEventListener( 'mousedown', ()=> {

		rect = CANVAS.getBoundingClientRect();
		
		mouse.x = ( event.clientX / rect.width ) * 2 - 1;
		mouse.y = - ( (event.clientY - rect.top) / rect.height ) * 2 + 1;

		if ( state == 'select-tile' ) {

			drawer.raycast( mouse, 'select-tile' );

		} else if ( state == 'delete-tile' ) {

			atlas.raycast( mouse, 'delete-tile' );

		} else if ( state == 'paint' ) {

			atlas.raycast( mouse, 'paint', currentPaint );

		} else if ( state == 'show-tag' ) {

			atlas.raycast( mouse, 'show-tag' );

		} else if ( state == 'assign-tag' ) {

			atlas.raycast( mouse, 'assign-tag' );

		} else if (  state == 'delete-tag') {

			atlas.raycast( mouse, 'delete-tag' );

		} else if ( state == 'draw-cube' ) {

			atlas.raycast( mouse, 'draw-cube' );

		} else if ( state == 'delete-cube' ) {

			atlas.raycast( mouse, 'delete-cube' );

		} else if ( state == 'select-cube' ) {

			atlas.raycast( mouse, 'select-cube' );

		} else if ( state == 'select-plane' ) {

			atlas.raycast( mouse, 'select-plane' );

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

		} else if ( state == 'move-plane' ) {

			if ( int == 1 ) {

				atlas.movePlane( -1 )

			} else if ( int == 3 ) {

				atlas.movePlane( 1 )

			};

		};

	};



	function validate() {

		if ( state == 'select-edge' ) {

			drawer.validateEdge();

		} else if ( state == 'select-orientation' ) {

			atlas.validateTile();

		} else if ( state == 'move-cube' ) {

			appConsole.log( 'switch transform control type' );

			if ( transformControl.mode == 'translate' ) {

				transformControl.setMode( 'scale' );

			} else {

				transformControl.setMode( 'translate' );

			};

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
		transformControl.detach();
		appConsole.log('Abort all functions');
	};


	function getNewTag( element ) {
		currentElement = element ;
		setState('get-tag-name');
		appConsole.log('WRITE new TAG NAME');
		domGeneralInputField.value = '';
		domGeneralInputContainer.style.display = 'inherit' ;
	};


	function onGeneralSubmit( e ) {
		currentElement.tag = domGeneralInputField.value ;
		appConsole.log( `element's TAG set to '${ domGeneralInputField.value }'` )
		domGeneralInputContainer.style.display = 'none' ;
	};
	


	return {
		setState,
		clickPaint,
		getNewTag,
		onGeneralSubmit,
		moveCube,
		movePlane
	};

};