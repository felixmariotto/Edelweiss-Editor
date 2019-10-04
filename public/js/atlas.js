
function Atlas() {

	// WALLS MATERIALS
	const SLIPWALLMAT = new THREE.MeshLambertMaterial({
		color: 0xff9cc7,
		side: THREE.DoubleSide
	});

	// GROUND MATERIALS
	const BASICGROUNDMAT = new THREE.MeshLambertMaterial({
		color: 0x777777,
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



	Tile(
		new THREE.Vector3( 1, 0, 1 ),
		new THREE.Vector3( 2, 0, 2 )
	);


	Tile(
		new THREE.Vector3( -1, 0, 0 ),
		new THREE.Vector3( -1, 1, 1 )
	);



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

			logicTile.type = 'basic-ground' ;

		// WALL
		} else {

			logicTile.type = 'slip-wall' ;
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






	function MeshTile( logicTile ) {

		// get material according to logicType's type
		let material ;

		switch ( logicTile.type ) {

			case 'basic-ground' :
				material = new THREE.MeshLambertMaterial().copy( BASICGROUNDMAT ) ;
				break;
			case 'slip-wall' :
				material = new THREE.MeshLambertMaterial().copy( SLIPWALLMAT ) ;
				break;

		};

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




	return {
		meshTiles,
		TempTile,
		clearTempTiles,
		highlightTile,
		validateTile
	};


};