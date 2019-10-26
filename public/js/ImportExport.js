
function ImportExport() {


    // var exporter = new THREE.OBJExporter();
    var exporter = new THREE.GLTFExporter();


    var hashTable = {
        true: '$t',
        false: '$f',
        position: '$p',
        type: '$k',
        points: '$v',
        isWall: '$w',
        isXAligned: '$i',
        'ground-basic': '$g',
        'ground-start': '$s',
        'wall-limit': '$l',
        'wall-easy': '$e',
        'wall-medium' : '$m',
        'wall-hard': '$h',
        'wall-fall': '$a',
        'wall-slip': '$c',
        'cube-inert': '$r',
        'cube-interactive': '$q',
        'cube-trigger': '$o'
    };



    function hashJSON( data ) {

        for ( let valueToReplace of Object.keys( hashTable ) ) {

            data = data.replace( new RegExp( valueToReplace, 'g' ), hashTable[ valueToReplace ] );

        };

        return data ;
    };



    function parseJSON( data ) {

        for ( let valueToReplace of Object.keys( hashTable ) ) {

            text = hashTable[ valueToReplace ]
            text = text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');

            data = data.replace( new RegExp( text , 'g' ), valueToReplace );

        };

        return JSON.parse( data ) ;
    };



    function exportSceneGLTF() {

        exporter.parse( scene, (result)=> {

            var output = JSON.stringify( result, null, 2 );

            var file = new File([output], "logicScene.gltf", {type: "text/plain;charset=utf-8"});
            saveAs(file);

        } );

    };



    function exportLogicJSON() {

        let sceneGraph = atlas.getSceneGraph();

        let data = hashJSON( JSON.stringify( sceneGraph ) );

        let compressedData = lzjs.compress( data );

        var file = new File([compressedData], "sceneGraph.json", {type: "text/plain;charset=utf-8"});
        saveAs(file);

    };



    function openSceneJSON( evt ) {

        var tgt = evt.target || window.event.srcElement,
            files = tgt.files;
    
        // FileReader support
        if (FileReader && files && files.length) {

            var fr = new FileReader();

            fr.onload = function () {

                let data = lzjs.decompress( fr.result );

                let sceneGraph = parseJSON( data );

                console.log( sceneGraph );

                // Initialize atlas with the scene graph
                atlas.openScene( sceneGraph );
            };

            fr.readAsText(files[0]);

        };

    };



    return {
        exportSceneGLTF,
        exportLogicJSON,
        openSceneJSON
    };
};