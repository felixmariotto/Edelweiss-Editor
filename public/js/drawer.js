

function Drawer() {

	const domDrawTile = document.getElementById('draw-tile');
	const domDrawCube = document.getElementById('draw-cube');

	const domDelTile = document.getElementById('delete-tile');
	const domDelCube = document.getElementById('delete-cube');

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

		};

	};




	//////////////
	//  DRAWING
	///////////////

	domDrawTile.addEventListener('click', ()=> {
		console.log('draw tile');
	});

	domDrawCube.addEventListener('click', ()=> {
		console.log('draw cube');
	});



	/////////////////
	// DELETION
	////////////////

	domDelTile.addEventListener('click', ()=> {
		console.log('delete tile');
	});

	domDelCube.addEventListener('click', ()=> {
		console.log('delete cube');
	});



	return {
		raycast
	};

};