


function init() {

	let rect = CANVAS.getBoundingClientRect();
	
	scene = new THREE.Scene();
	scene.background = new THREE.Color( 0x555555 );

	camera = new THREE.PerspectiveCamera( 40, rect.width/rect.height, 0.1, 1000 );
	camera.position.set( 0, 2, 10 );
	camera.lookAt( 0, 0, 0 );

	var ambientLight = new THREE.AmbientLight( 0xffffff, 0.5 );
	scene.add( ambientLight );

	var directionalLight = new THREE.DirectionalLight( 0xffffff, 0.5 );
	directionalLight.position.set( 0.24, 0.78, 0.56 );
	scene.add( directionalLight );

	controls = new THREE.OrbitControls( camera, CANVAS );
	controls.screenSpacePanning = true ;
	controls.keys = [];

	renderer = new THREE.WebGLRenderer({ canvas: CANVAS, antialias:true, alpha:true });
	renderer.setSize( rect.width, rect.height );

	stats = new Stats();
	document.body.appendChild( stats.dom );
	stats.dom.style.top = "auto";
	stats.dom.style.bottom = "0px";

	atlas = Atlas();
	drawer = Drawer();
	input = Input();
	appConsole = AppConsole();

	loop();
};