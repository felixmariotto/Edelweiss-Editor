
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



	Tile(
		new THREE.Vector3( 0, 0, 0 ),
		new THREE.Vector3( 1, 0, 1 )
	);

	Tile(
		new THREE.Vector3( 0, 0, 0 ),
		new THREE.Vector3( 1, 1, 0 )
	);




	function Tile( vec1, vec2 ) {

		// GROUND
		if ( vec1.y == vec2.y ) {

			let logicTile = LogicTile( vec1, vec2 );
			logicTile.type = 'basic-ground' ;
			let meshTile = MeshTile( logicTile ) ;
			scene.add( meshTile );
			

		// WALL
		} else {

			let logicTile = LogicTile( vec1, vec2 );
			logicTile.type = 'slip-wall' ;
			logicTile.isWall = true ;
			let meshTile = MeshTile( logicTile ) ;
			scene.add( meshTile );

		};

	};






	function MeshTile( logicTile ) {

		// get material according to logicType's type
		let material ;

		switch ( logicTile.type ) {

			case 'basic-ground' :
				material = BASICGROUNDMAT ;
				break;
			case 'slip-wall' :
				material = SLIPWALLMAT ;
				break;

		};

		let geometry = new THREE.PlaneBufferGeometry( 1, 1, 1 );

		let mesh = new THREE.Mesh( geometry, material );

		if ( logicTile.isWall ) {
			mesh.position.set( 0.5, 0.5, 0 );
		} else {
			mesh.rotation.x = Math.PI / 2 ;
			mesh.position.set( 0.5, 0, 0.5 );
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






};