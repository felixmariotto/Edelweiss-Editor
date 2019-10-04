

var scene, camera, renderer, stats, controls, atlas, drawer, input ;
var appConsole ;

const CANVAS = document.getElementById('world');


window.addEventListener('load', ()=> {
	init();
});

window.addEventListener( 'resize', onWindowResize, false );


function onWindowResize() {
	let rect = CANVAS.getBoundingClientRect();
	camera.aspect = (window.innerWidth - 240) / rect.height;
	camera.updateProjectionMatrix();
	renderer.setSize( (window.innerWidth - 240), rect.height );
};