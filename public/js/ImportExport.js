
function ImportExport() {

    var exporter = new THREE.OBJExporter();

    function exportSceneOBJ() {

        var result = exporter.parse( scene );
        console.log( result );

        var file = new File([result], "logicScene.obj", {type: "text/plain;charset=utf-8"});
        saveAs(file);

    };

    return {
        exportSceneOBJ
    };
};