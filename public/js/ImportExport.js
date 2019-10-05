
function ImportExport() {


    var exporter = new THREE.OBJExporter();


    function exportSceneOBJ() {

        var result = exporter.parse( scene );

        var file = new File([result], "logicScene.obj", {type: "text/plain;charset=utf-8"});
        saveAs(file);

    };



    function exportLogicJSON() {

        let sceneGraph = JSON.stringify( atlas.getSceneGraph() ) ;

        var file = new File([sceneGraph], "sceneGraph.json", {type: "text/plain;charset=utf-8"});
        saveAs(file);

    };



    return {
        exportSceneOBJ,
        exportLogicJSON
    };
};