
function Atlas() {


	const CUBEWIDTH = 0.4 ;

	const raycaster = new THREE.Raycaster();
	var intersects ;
	var filtered = false ;




	// CUBES MATERIALS
	const INERTCUBEMAT = new THREE.MeshLambertMaterial({
		color: 0x9d9d9e
	});

	const INTERACTIVECUBEMAT = new THREE.MeshLambertMaterial({
		color: 0xffdebd
	});

	const TRIGGERCUBEMAT = new THREE.MeshLambertMaterial({
		color: 0x276b00
	});




	// WALLS MATERIALS
	const SLIPWALLMAT = new THREE.MeshLambertMaterial({
		color: 0xff9cc7,
		side: THREE.DoubleSide
	});

	const FALLWALLMAT = new THREE.MeshLambertMaterial({
		color: 0x9e0000,
		side: THREE.DoubleSide
	});

	const LIMITWALLMAT = new THREE.MeshLambertMaterial({
		color: 0x0f0aa6,
		side: THREE.DoubleSide
	});

	const EASYWALLMAT = new THREE.MeshLambertMaterial({
		color: 0xb0ffa8,
		side: THREE.DoubleSide
	});

	const MEDIUMWALLMAT = new THREE.MeshLambertMaterial({
		color: 0x17ad28,
		side: THREE.DoubleSide
	});

	const HARDWALLMAT = new THREE.MeshLambertMaterial({
		color: 0x057a34,
		side: THREE.DoubleSide
	});




	// GROUND MATERIALS
	const BASICGROUNDMAT = new THREE.MeshLambertMaterial({
		color: 0x777777,
		side: THREE.DoubleSide
	});

	const SPECIALGROUNDMAT = new THREE.MeshLambertMaterial({
		color: 0xff9b05,
		side: THREE.DoubleSide
	});

	const STARTGROUNDMAT = new THREE.MeshLambertMaterial({
		color: 0x3dffff,
		side: THREE.DoubleSide
	});




	// TEMP TILES MATERIAL
	const TEMPTILEMAT = new THREE.MeshLambertMaterial({
		color: 0xffffff,
		transparent: true,
		opacity: 0.5,
		side: THREE.DoubleSide
	});



	var meshTiles = [];
	var tempTiles = [];
	var highlightedTempTile;
	var startTile;

	var meshCubes = [];








	////////////////
	///    INIT
	////////////////



	Tile(
		new THREE.Vector3( 1, 0, 1 ),
		new THREE.Vector3( 2, 0, 2 )
	);


	Tile(
		new THREE.Vector3( -1, 0, 0 ),
		new THREE.Vector3( -1, 1, 1 )
	);










	/////////////////
	///  PLANES
	/////////////////


	var planeFront = new THREE.Plane( new THREE.Vector3( 0, 0, -1 ), 3 );
	makePlaneHelper( planeFront, 0 );

	var planeBack = new THREE.Plane( new THREE.Vector3( 0, 0, 1 ), 3 );
	makePlaneHelper( planeBack, 0 );

	var planeLeft = new THREE.Plane( new THREE.Vector3( -1, 0, 0 ), 3 );
	makePlaneHelper( planeLeft, Math.PI / 2 );

	var planeRight = new THREE.Plane( new THREE.Vector3( 1, 0, 0 ), 3 );
	makePlaneHelper( planeRight, Math.PI / 2 );

	var planeMeshes = [
		planeFront.helper,
		planeBack.helper,
		planeLeft.helper,
		planeRight.helper
	];

	var selectedPlane ;



	function makePlaneHelper( plane, rotation ) {

		let geometry = new THREE.PlaneBufferGeometry( 5, 5 );
		let material = new THREE.MeshBasicMaterial({
			color: 0xffff00,
			side: THREE.DoubleSide,
			transparent: true,
			opacity: 0.1
		});

		let mesh = new THREE.Mesh( geometry, material );
		mesh.position.copy( plane.normal );
		mesh.position.negate();
		mesh.position.multiplyScalar( plane.constant );

		mesh.rotation.y = rotation ;

		mesh.visible = false ;

		mesh.plane = plane ;

		plane.helper = mesh ;

		scene.add( mesh );

	};





	function showPlanes() {

		planeMeshes.forEach( (planeMesh)=> {

			planeMesh.visible = !planeMesh.visible ;

		});

	};





	function movePlane( direction ) {

		selectedPlane.constant += direction ;

		selectedPlane.helper.position.addScaledVector(
			selectedPlane.normal,
			direction * -1
		);

	};














	function raycast( mouse, action, paintName ) {

		if ( action == 'select-plane' ) {

			raycaster.setFromCamera( mouse, camera );
			intersects = raycaster.intersectObjects( planeMeshes );

			if ( intersects.length > 0 ) {

				input.movePlane();
				selectedPlane = intersects[0].object.plane ;

			};

		} else {

			raycaster.setFromCamera( mouse, camera );
			intersects = raycaster.intersectObjects( meshTiles.concat( meshCubes ) );

			if ( intersects.length > 0 ) {

				if ( action == "delete-tile" ) {

					if ( meshTiles.indexOf( intersects[0].object ) > -1 ) {

						deleteTile( intersects[0].object );

					};

				} else if ( action == 'paint' ) {

					paintTile( intersects[0].object, paintName );

				} else if ( action == 'show-tag' ) {

					appConsole.log(
						`the TAG of this element is : ${
							intersects[0].object.logicTile ?
									intersects[0].object.logicTile.tag :
									intersects[0].object.logicCube.tag
						}`
					);

				} else if ( action == 'assign-tag' ) {

					input.getNewTag(
						intersects[0].object.logicTile ?
								intersects[0].object.logicTile :
								intersects[0].object.logicCube
					);

				} else if ( action == 'delete-tag' ) {

					let obj = intersects[0].object.logicTile ?
									intersects[0].object.logicTile :
									intersects[0].object.logicCube

					obj.tag = undefined ;

					appConsole.log('TAG REMOVED from the element');

				} else if ( action == 'draw-cube' ) {

					newCube( intersects[0].point );

				} else if ( action == 'delete-cube' ) {

					if ( meshCubes.indexOf( intersects[0].object ) > -1 ) {

						deleteCube( intersects[0].object );

					};

				} else if ( action == 'select-cube' ) {

					if ( meshCubes.indexOf( intersects[0].object ) > -1 ) {

						input.moveCube( intersects[0].object );

					};

				};

			};

		};

	};


	










	function clearTempTiles() {

		if ( tempTiles.length > 0 ) {

			tempTiles.forEach( (meshTile)=> {

				deleteTile( meshTile );

			});

			tempTiles = [];
			highlightedTempTile = undefined ;
		};
	};









	function clearScene() {

		// delete tiles
		for (let i = meshTiles.length - 1 ; i > -1 ; i--) {

			deleteTile( meshTiles[i] );

		};

		// delete planes
		[ planeFront, planeBack, planeLeft, planeRight ].forEach( (plane)=> {

			plane.helper.geometry.dispose();
			plane.helper.material.dispose();
			scene.remove( plane.helper );

			plane = undefined ;

		});

		planeMeshes = [];

		selectedPlane = undefined ;

	};








	function deleteTile( meshTile ) {

		meshTiles.splice( meshTiles.indexOf(meshTile), 1 );

		meshTile.material.dispose();
		meshTile.geometry.dispose();

		scene.remove( meshTile );
	};







	function deleteCube( meshCube ) {

		meshCubes.splice( meshCubes.indexOf(meshCube), 1 );

		meshCube.material.dispose();
		meshCube.geometry.dispose();

		scene.remove( meshCube );
	};










	function paintTile( mesh, paintName ) {

		// We check if its tile paint
		if ( paintName.indexOf('ground') > -1 ||
			 paintName.indexOf('wall') > -1 ) {

			if ( mesh.logicTile ) {

				if ( mesh.logicTile.isWall && paintName.indexOf('wall') > -1 ) {

					applyPaint( mesh, paintName );

				} else if ( !mesh.logicTile.isWall && paintName.indexOf('ground') > -1 ) {

					if ( paintName == 'ground-start' && startTile ) {
						applyPaint( startTile, 'ground-basic' );
					};

					startTile = mesh ;

					applyPaint( mesh, paintName );

				} else {

					appConsole.log( 'Choose a paint appropriate to the TYPE OF TILE' );

				};

				function applyPaint( mesh, paintName ) {
					mesh.logicTile.type = paintName ;
					mesh.material = getMaterial( paintName );
				};

			} else {

				appConsole.log( 'You cannot apply a TILE PAINT to a CUBE' );

			};

		// If it's not tile paint, then it's cube paint
		} else {

			if ( mesh.logicCube ) {

				applyPaint( mesh, paintName );

				function applyPaint( mesh, paintName ) {
					mesh.logicCube.type = paintName ;
					mesh.material = getMaterial( paintName );
				};

			} else {

				appConsole.log( 'You cannot apply a CUBE PAINT to a TILE' );

			};

		};

	};










	function validateTile() {

		if ( tempTiles.length > 0 ) {

			tempTiles.forEach( (meshTile)=> {

				if ( meshTile != highlightedTempTile ) {
					deleteTile( meshTile );
				};

			});

			highlightedTempTile.material = highlightedTempTile.logicTile.isWall ?
													SLIPWALLMAT :
													BASICGROUNDMAT;
			highlightedTempTile.visible = true ;

			drawer.unselect();
			drawer.selectTile( highlightedTempTile ) ;

			tempTiles = [];
			highlightedTempTile = undefined ;

		};

	};










	function highlightTile( int ) {

		tempTiles.forEach( (meshTile)=> {
			meshTile.visible = false ;
		});

		highlightedTempTile = tempTiles[ int ];
		tempTiles[ int ].visible = true ;

	};










	function TempTile( vec1, vec2 ) {

		// round the values to make clean tiles
		[vec1, vec2].forEach( (vec)=> {
			vec.x = Math.round( vec.x );
			vec.y = Math.round( vec.y );
			vec.z = Math.round( vec.z );
		});

		let meshTile = Tile( vec1, vec2 );

		tempTiles.push( meshTile );

		if ( tempTiles.length != 1 ) {

			meshTile.visible = false ;

		} else {

			highlightedTempTile = meshTile ;
		};

		meshTile.material = new THREE.MeshLambertMaterial().copy( TEMPTILEMAT );
	};











	function Tile( vec1, vec2 ) {

		let logicTile = LogicTile( vec1, vec2 );

		// GROUND
		if ( vec1.y == vec2.y ) {

			logicTile.type = 'ground-basic' ;

		// WALL
		} else {

			logicTile.type = 'wall-slip' ;
			logicTile.isWall = true ;

			if ( vec1.z == vec2.z ) {
			
				logicTile.isXAligned = true ;

			} else {

				logicTile.isXAligned = false ;
			};

		};

		let meshTile = MeshTile( logicTile ) ;
		meshTile.logicTile = logicTile ;
		scene.add( meshTile );
		meshTiles.push( meshTile );

		return meshTile ;

	};








	function newCube( position, scale, skipMoving ) {

		scale = scale || { x:1, y:1, z:1 };

		let logicCube = {
			position: new THREE.Vector3(
				position.x,
				position.y,
				position.z
			),
			scale: new THREE.Vector3(
				scale.x,
				scale.y,
				scale.z
			),
			type: 'cube-inert'
			// tag
			// interactive
		};

		let meshCube = MeshCube( logicCube );
		meshCube.logicCube = logicCube ;
		scene.add( meshCube );
		meshCubes.push( meshCube );

		if ( !skipMoving ) {
			input.moveCube( meshCube );
		};

		return meshCube ;

	};




	function MeshCube( logicCube ) {

		let material = getMaterial( logicCube.type );
		let geometry = new THREE.BoxBufferGeometry(
			CUBEWIDTH,
			CUBEWIDTH,
			CUBEWIDTH
		);
		let mesh = new THREE.Mesh( geometry, material );

		mesh.position.copy( logicCube.position );
		mesh.scale.copy( logicCube.scale );

		return mesh ;

	};







	function getMaterial( type ) {

		switch ( type ) {

			case 'ground-basic' :
				return BASICGROUNDMAT ;

			case 'ground-special' :
				return SPECIALGROUNDMAT ;

			case 'ground-start' :
				return STARTGROUNDMAT ;
			
			case 'wall-limit' :
				return LIMITWALLMAT ;

			case 'wall-easy' :
				return EASYWALLMAT ;

			case 'wall-medium' :
				return MEDIUMWALLMAT ;

			case 'wall-hard' :
				return HARDWALLMAT ;

			case 'wall-fall' :
				return FALLWALLMAT ;

			case 'wall-slip' :
				return SLIPWALLMAT ;

			case 'cube-inert' :
				return INERTCUBEMAT ;

			case 'cube-interactive' :
				return INTERACTIVECUBEMAT ;

			case 'cube-trigger' :
				return TRIGGERCUBEMAT ;

			default :
				console.error('cannot get material');
				break;

		};

	};




	function MeshTile( logicTile ) {

		// get material according to logicType's type
		let material = getMaterial( logicTile.type );

		let geometry = new THREE.PlaneBufferGeometry( 1, 1, 1 );

		let mesh = new THREE.Mesh( geometry, material );

		mesh.position.set(
			( logicTile.points[0].x + logicTile.points[1].x ) / 2,
			( logicTile.points[0].y + logicTile.points[1].y ) / 2,
			( logicTile.points[0].z + logicTile.points[1].z ) / 2
		);


		if ( logicTile.isWall ) {

			if ( logicTile.points[0].x == logicTile.points[1].x ) {
				mesh.rotation.y = Math.PI / 2 ;
			};

		} else {

			mesh.rotation.x = Math.PI / 2 ;

		};

		return mesh ;

	};






	function LogicTile( vec1, vec2 ) {

		let logicTile = {
			points: [vec1, vec2]
			// type
			// isWall
			// isXAligned
		};

		return logicTile ;
	};





	function roundVecTo( vec, decim ) {

		for ( dir of Object.keys( vec ) ) {

			vec[ dir ] = Number( vec[ dir ].toFixed( decim ) );

		};

	};





	function getSceneGraph() {


		let tilesGraph = [] ;
		let cubesGraph = [] ;
		let planes = [];
		let min ;
		let stage ;


		meshTiles.forEach( (meshTile)=> {

			stage = Math.min( meshTile.logicTile.points[0].y,
							meshTile.logicTile.points[1].y
						);

			stage = Math.floor( stage );

			if ( !tilesGraph[ stage ] ) {

				tilesGraph[ stage ] = [ meshTile.logicTile ];

			} else {

				tilesGraph[ stage ].push( meshTile.logicTile );

			};

		});


		meshCubes.forEach( (meshCube)=> {

			stage = Math.floor( meshCube.position.y );
			meshCube.logicCube.position.copy( meshCube.position );
			meshCube.logicCube.scale.copy( meshCube.scale );

			roundVecTo( meshCube.logicCube.position, 1 );
			roundVecTo( meshCube.logicCube.scale, 1 );

			if ( !cubesGraph[ stage ] ) {

				cubesGraph[ stage ] = [ meshCube.logicCube ];

			} else {

				cubesGraph[ stage ].push( meshCube.logicCube );

			};

		});


		planeMeshes.forEach( (meshPlane)=> {

			planes.push( {
				norm: {
					x: meshPlane.plane.normal.x,
					z: meshPlane.plane.normal.z,
				},
				const: meshPlane.plane.constant
			} );

		});


		let sceneGraph = {
			tilesGraph,
			cubesGraph,
			planes
		};

		console.log( sceneGraph );

		return sceneGraph ;

	};









	function openScene( sceneGraph ) {

		clearScene();


		////  RE CREATE TILES

		sceneGraph.tilesGraph.forEach( (stage)=> {

			stage.forEach( (logicTile)=> {

				let meshTile = Tile(
					logicTile.points[0],
					logicTile.points[1]
				);
				paintTile( meshTile, logicTile.type );

				if ( logicTile.tag ) {
					meshTile.logicTile.tag = logicTile.tag ;
				};

			});

		});



		////  RE CREATE CUBES

		sceneGraph.cubesGraph.forEach( (stage)=> {

			if ( stage ) {

				stage.forEach( (logicCube)=> {

					let meshCube = newCube(
						logicCube.position,
						logicCube.scale,
						true
					);
					paintTile( meshCube, logicCube.type );

					if ( logicCube.tag ) {
						meshCube.logicCube.tag = logicCube.tag ;
					};

				});

			};

		});



		////  RE CREATE PLANES

		sceneGraph.planes.forEach( (plane)=> {

			// Left plane
			if ( plane.norm.x == -1 ) {

				planeLeft = new THREE.Plane( new THREE.Vector3( -1, 0, 0 ), plane.const );
				makePlaneHelper( planeLeft, Math.PI / 2 );

			} else if ( plane.norm.x == 1 ) {

				planeRight = new THREE.Plane( new THREE.Vector3( 1, 0, 0 ), plane.const );
				makePlaneHelper( planeRight, Math.PI / 2 );

			} else if ( plane.norm.z == -1 ) {

				planeFront = new THREE.Plane( new THREE.Vector3( 0, 0, -1 ), plane.const );
				makePlaneHelper( planeFront, 0 );

			} else if ( plane.norm.z == 1 ) {

				planeBack = new THREE.Plane( new THREE.Vector3( 0, 0, 1 ), plane.const );
				makePlaneHelper( planeBack, 0 );

			};

		});

		planeMeshes = [
			planeFront.helper,
			planeBack.helper,
			planeLeft.helper,
			planeRight.helper
		];


	};













	function filterTaggedElements() {

		if ( filtered ) {

			appConsole.log('SHOW all elements');

			meshTiles
				.concat( meshCubes )
				.forEach( (mesh)=> {
					mesh.visible = true
				});

		} else {

			appConsole.log('HIDE all elements without TAG');

			meshTiles
				.concat( meshCubes )
				.forEach( (mesh)=> {

					if ( mesh.logicTile && mesh.logicTile.tag ||
						 mesh.logicCube && mesh.logicCube.tag ) {

						mesh.visible = true ;

					} else {

						mesh.visible = false ;

					};

				});

		};

		filtered = !filtered ;

	};




	return {
		raycast,
		meshTiles,
		TempTile,
		clearTempTiles,
		highlightTile,
		validateTile,
		getSceneGraph,
		openScene,
		filterTaggedElements,
		showPlanes,
		movePlane
	};


};