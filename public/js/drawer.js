

function Drawer() {


	const raycaster = new THREE.Raycaster();
	var intersects;

	var selectedTile;



	function raycast( mouse ) {

		raycaster.setFromCamera( mouse, camera );
		intersects = raycaster.intersectObjects( atlas.meshTiles );


		// unselect previous tile
		if ( selectedTile ) {
			selectedTile.material.wireframe = false ;
			selectedTile = undefined ;
		};


		if ( intersects.length > 0 ) {

			intersects[ 0 ].object.material.wireframe = true ;
			selectedTile = intersects[ 0 ].object ;

			input.setState( 'select-edge' );
			appConsole.log( 'Choose an edge with arrows' );

		};

	};



	return {
		raycast
	};

};