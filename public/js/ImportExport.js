
function ImportExport() {


    var exporter = new THREE.OBJExporter();


    function exportSceneOBJ() {

        var result = exporter.parse( scene );
        console.log( result );

        var file = new File([result], "logicScene.obj", {type: "text/plain;charset=utf-8"});
        saveAs(file);

    };


    function sendSceneToServer() {

        let data = {
            color: "#" + Math.random().toString(16).slice(2, 8),
            sceneGraph: {a:0}
        };
        
        var req = new XMLHttpRequest();

        req.onreadystatechange = function(event) {
            if (this.readyState == 4) {
                if (this.status == 200) {
                    appConsole.log('Scene saved in the Database');
                };
            };
        };

        req.open('POST', '/logic_scene');
        req.setRequestHeader('Content-type', 'application/json');
        req.send( JSON.stringify(data) );

    };


    return {
        exportSceneOBJ,
        sendSceneToServer
    };
};