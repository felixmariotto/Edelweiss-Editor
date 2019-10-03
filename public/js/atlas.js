
function Atlas() {

	// WALLS MATERIALS
	const SLIPWALLMAT = new THREE.MeshLambertMaterial({ color: 0xff00ff });

	// GROUND MATERIALS
	const BASICGROUNDMAT = new THREE.MeshLambertMaterial({ color: 0x777777 });



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

		// create a mesh from the vectors contained in logicTile

		// return the mesh

	};






	function LogicTile( vec1, vec2 ) {

		let logicTile = {
			points: [vec1, vec2]
			// groundType
			// wallType
			//isWall
		};

		return logicTile ;
	};






};