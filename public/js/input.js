

function Input() {

	var mouse = new THREE.Vector2();
	var rect ;

	CANVAS.addEventListener( 'click', onClick, false );

	function onClick( event ) {

		rect = CANVAS.getBoundingClientRect();
		
		mouse.x = ( event.clientX / rect.width ) * 2 - 1;
		mouse.y = - ( (event.clientY - rect.top) / rect.height ) * 2 + 1;

		drawer.raycast( mouse );

	};

};