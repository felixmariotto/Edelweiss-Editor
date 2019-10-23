
function ImportExport() {


    var exporter = new THREE.OBJExporter();


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



    function exportSceneOBJ() {

        var result = exporter.parse( scene );

        var file = new File([result], "logicScene.obj", {type: "text/plain;charset=utf-8"});
        saveAs(file);

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

                atlas.openScene( fr.result )
            };

            fr.readAsText(files[0]);

        };

    };



    return {
        exportSceneOBJ,
        exportLogicJSON,
        openSceneJSON
    };
};