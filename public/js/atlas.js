
function Atlas() {


	const raycaster = new THREE.Raycaster();
	var intersects ;


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



	Tile(
		new THREE.Vector3( 1, 0, 1 ),
		new THREE.Vector3( 2, 0, 2 )
	);


	Tile(
		new THREE.Vector3( -1, 0, 0 ),
		new THREE.Vector3( -1, 1, 1 )
	);






	function raycast( mouse, action, paintName ) {

		raycaster.setFromCamera( mouse, camera );
		intersects = raycaster.intersectObjects( meshTiles );

		if ( intersects.length > 0 ) {

			if ( action == "delete-tile" ) {

				deleteTile( intersects[0].object );

			} else if ( action == 'paint' ) {

				paintTile( intersects[0].object, paintName );

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



	function deleteTile( meshTile ) {

		meshTiles.splice( meshTiles.indexOf(meshTile), 1 );

		meshTile.material.dispose();
		meshTile.geometry.dispose();

		scene.remove( meshTile );
	};




	function paintTile( meshTile, paintName ) {

		if ( meshTile.logicTile.isWall && paintName.indexOf('wall') > -1 ) {

			applyPaint( meshTile, paintName );

		} else if ( !meshTile.logicTile.isWall && paintName.indexOf('ground') > -1 ) {

			if ( paintName == 'ground-start' && startTile ) {
				applyPaint( startTile, 'ground-basic' );
			};

			startTile = meshTile ;

			applyPaint( meshTile, paintName );

		} else {

			appConsole.log( 'Choose a paint appropriate to the type of tile' );

		};

		function applyPaint( meshTile, paintName ) {
			meshTile.logicTile.type = paintName ;
			meshTile.material = getMaterial( paintName );
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




	function getMaterial( type ) {

		switch ( type ) {

			case 'ground-basic' :
				return BASICGROUNDMAT ;

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
		};

		return logicTile ;
	};




	function getSceneGraph() {

		let sceneGraph = [] ;
		let min ;
		let stage ;

		meshTiles.forEach( (meshTile)=> {

			stage = Math.min( meshTile.logicTile.points[0].y,
							meshTile.logicTile.points[1].y
						);

			stage = Math.floor( stage );

			if ( !sceneGraph[ stage ] ) {

				sceneGraph[ stage ] = [ meshTile.logicTile ];

			} else {

				sceneGraph[ stage ].push( meshTile.logicTile );

			};

		});

		console.log( sceneGraph );

		return sceneGraph ;

	};




	return {
		raycast,
		meshTiles,
		TempTile,
		clearTempTiles,
		highlightTile,
		validateTile,
		getSceneGraph
	};


};