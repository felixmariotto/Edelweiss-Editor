

function loop() {

	requestAnimationFrame( loop );

	renderer.render( scene, camera );

	controls.update();
	stats.update();

};