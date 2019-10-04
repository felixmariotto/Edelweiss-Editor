
function Atlas() {

	// WALLS MATERIALS
	const SLIPWALLMAT = new THREE.MeshBasicMaterial({
		color: 0xff00ff,
		side: THREE.DoubleSide
	});

	// GROUND MATERIALS
	const BASICGROUNDMAT = new THREE.MeshBasicMaterial({
		color: 0x777777,
		side: THREE.DoubleSide
	});

	var meshTiles = [];



	Tile(
		new THREE.Vector3( 1, 0, 1 ),
		new THREE.Vector3( 2, 0, 2 )
	);

	Tile(
		new THREE.Vector3( 0, 0, 0 ),
		new THREE.Vector3( 1, 1, 0 )
	);

	Tile(
		new THREE.Vector3( 0, 1, 0 ),
		new THREE.Vector3( 1, 2, 0 )
	);

	Tile(
		new THREE.Vector3( 5, 1, 0 ),
		new THREE.Vector3( 6, 2, 0 )
	);

	Tile(
		new THREE.Vector3( 5, -1, 0 ),
		new THREE.Vector3( 6, -1, -1 )
	);




	function Tile( vec1, vec2 ) {

		let logicTile = LogicTile( vec1, vec2 );

		// GROUND
		if ( vec1.y == vec2.y ) {

			logicTile.type = 'basic-ground' ;

		// WALL
		} else {

			logicTile.type = 'slip-wall' ;
			logicTile.isWall = true ;

		};

		let meshTile = MeshTile( logicTile ) ;
		meshTile.logicTile = logicTile ;
		scene.add( meshTile );
		meshTiles.push( meshTile );

	};






	function MeshTile( logicTile ) {

		// get material according to logicType's type
		let material ;

		switch ( logicTile.type ) {

			case 'basic-ground' :
				material = new THREE.MeshBasicMaterial().copy( BASICGROUNDMAT ) ;
				break;
			case 'slip-wall' :
				material = new THREE.MeshBasicMaterial().copy( SLIPWALLMAT ) ;
				break;

		};

		let geometry = new THREE.PlaneBufferGeometry( 1, 1, 1 );

		let mesh = new THREE.Mesh( geometry, material );

		if ( logicTile.isWall ) {

			mesh.position.set(
				( logicTile.points[0].x + logicTile.points[1].x ) / 2,
				( logicTile.points[0].y + logicTile.points[1].y ) / 2,
				0
			);

		} else {

			mesh.rotation.x = Math.PI / 2 ;
			mesh.position.set(
				( logicTile.points[0].x + logicTile.points[1].x ) / 2,
				0,
				( logicTile.points[0].z + logicTile.points[1].z ) / 2
			);

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




	return {
		meshTiles
	};


};