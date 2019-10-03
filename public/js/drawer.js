

function Drawer() {

	const domDrawTile = document.getElementById('draw-tile');
	const domDrawCube = document.getElementById('draw-cube');

	const domDelTile = document.getElementById('delete-tile');
	const domDelCube = document.getElementById('delete-cube');



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

};