
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