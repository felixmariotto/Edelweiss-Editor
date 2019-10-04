

function Drawer() {


	const raycaster = new THREE.Raycaster();
	var intersects;

	var selectedTile;
	var edges = [];




	function raycast( mouse ) {

		raycaster.setFromCamera( mouse, camera );
		intersects = raycaster.intersectObjects( atlas.meshTiles );


		// unselect previous tile
		unselect();


		if ( intersects.length > 0 ) {

			intersects[ 0 ].object.material.wireframe = true ;
			selectedTile = intersects[ 0 ].object ;

			createEdges( selectedTile.logicTile );

			input.setState( 'select-edge' );
			appConsole.log( 'Choose edge with ARROWS, then press ENTER or SPACE' );

		};

	};







	function unselect() {

		if ( selectedTile ) {

			selectedTile.material.wireframe = false ;
			selectedTile = undefined ;

			// Delete the colored lines
			edges.forEach( (line)=> {
				line.material.dispose();
				line.geometry.dispose();
				scene.remove( line );
			});

			edges = [];
			
		};

	};








	function createEdges( logicTile ) {


		var material = new THREE.LineBasicMaterial({
			color: 0x0000ff
		});

		for (let i=0 ; i<4 ; i++) {
			edges[i] = new THREE.Geometry();
		};



		///////////////////
		///  LINES VERTS
		///////////////////
		
		if ( logicTile.isWall ) {

			edges[0].vertices.push(
				new THREE.Vector3().copy( logicTile.points[0] ),
				new THREE.Vector3( logicTile.points[0].x, logicTile.points[1].y, 0 )
			);

			edges[1].vertices.push(
				new THREE.Vector3( logicTile.points[0].x, logicTile.points[1].y, 0 ),
				new THREE.Vector3().copy( logicTile.points[1] )
			);

			edges[2].vertices.push(
				new THREE.Vector3().copy( logicTile.points[1] ),
				new THREE.Vector3( logicTile.points[1].x, logicTile.points[0].y, 0 )
			);

			edges[2].vertices.push(
				new THREE.Vector3( logicTile.points[1].x, logicTile.points[0].y, 0 ),
				new THREE.Vector3().copy( logicTile.points[0] )
			);

		};



		edges.forEach( (geom, i)=> {
			edges[i] = new THREE.Line( geom, material );
			scene.add( edges[i] );
		})

	};





	return {
		raycast,
		unselect
	};

};