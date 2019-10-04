

function Drawer() {


	const EDGECOLOR = 0xff0000 ;
	const EDGEHIGHLIGHT = 0xffffff ;

	const raycaster = new THREE.Raycaster();
	var intersects;

	var selectedTile;
	var selectedEdge;
	var edges = [];



	function raycast( mouse ) {

		raycaster.setFromCamera( mouse, camera );
		intersects = raycaster.intersectObjects( atlas.meshTiles );


		// unselect previous tile
		unselect();


		if ( intersects.length > 0 ) {

			intersects[ 0 ].object.scale.setScalar( 0.8 );
			selectedTile = intersects[ 0 ].object ;

			createEdges( selectedTile.logicTile );

			input.setState( 'select-edge' );
			appConsole.log( 'Choose EDGE with ARROWS, then press ENTER or SPACE' );

		};

	};







	function unselect() {

		if ( selectedTile ) {

			selectedTile.scale.setScalar( 1 );
			selectedTile = undefined ;
			selectedEdge = undefined ;

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

			edges[3].vertices.push(
				new THREE.Vector3( logicTile.points[1].x, logicTile.points[0].y, 0 ),
				new THREE.Vector3().copy( logicTile.points[0] )
			);

		};



		edges.forEach( (geom, i)=> {

			edges[i] = new THREE.Line(
				geom,
				new THREE.LineBasicMaterial({ color: EDGECOLOR })
			);

			scene.add( edges[i] );

		});

	};




	function highlightEdge( int ) {

		edges.forEach( (geom, i)=> {
			edges[ i ].material.color.set( EDGECOLOR );
		});

		edges[ int ].material.color.set( EDGEHIGHLIGHT );
		selectedEdge = edges[ int ] ;
	};




	function validateEdge() {

		if ( selectedEdge ) {

			input.setState( 'select-orientation' );
			appConsole.log( 'Choose ORIENTATION with ARROWS, then press ENTER or SPACE' );
		
		} else {

			appConsole.log( 'Select an edge before to continue' );
		};
	};





	return {
		raycast,
		unselect,
		highlightEdge,
		validateEdge
	};

};