

function Drawer() {


	const EDGECOLOR = 0xff0000 ;
	const EDGEHIGHLIGHT = 0xffffff ;

	const raycaster = new THREE.Raycaster();
	var intersects;

	var selectedTile;
	var selectedEdge;
	var edges = [];
	var axis = new THREE.Vector3();



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

			createNewTiles();

			input.setState( 'select-orientation' );
			appConsole.log( 'Choose ORIENTATION with ARROWS, then press ENTER or SPACE' );
		
		} else {

			appConsole.log( 'Select an edge before to continue' );
		};

	};





	function createNewTiles() {

		atlas.clearTempTiles();

		// get selected line's verts
		let verts = selectedEdge.geometry.vertices ;

		// return a copy of the verts of the line opposite to the selected one
		let oppVerts = edges[ ( edges.indexOf(selectedEdge) + 2 ) % 4 ].geometry.vertices // .slice(0) ;

		// update axis for the rotation
		verts[0].sub( verts[1] );
		axis.copy( verts[0] ).normalize() ;
		verts[0].add( verts[1] );

		// create 3 temporary tiles
		for (let i=1 ; i<4 ; i++) {
			
			// rotate one quarter
			for (let j=0 ; j<2 ; j++) {

				oppVerts[j].sub( verts[j] );
				oppVerts[j].applyAxisAngle( axis, Math.PI / 2 );
				oppVerts[j].add( verts[j] );

			};

			// get opposite verts for tile creation in atlas
			[ verts[1], oppVerts[0], oppVerts[1] ].forEach( (vec)=> {

				if ( verts[0].distanceTo( vec ) > 1.1 ) {

					// request a new temporary tile to the atlas
					atlas.TempTile(
						new THREE.Vector3().copy( vec ),
						new THREE.Vector3().copy( verts[0] )
					);

				};

			});

		};

		

		// TEMP
		edges[ ( edges.indexOf(selectedEdge) + 2 ) % 4 ].geometry.verticesNeedUpdate = true ;



	};










	return {
		raycast,
		unselect,
		highlightEdge,
		validateEdge
	};

};