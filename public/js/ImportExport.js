
function ImportExport() {


    // SIZE OF THE MAP CHUNKS
    const CHUNKSIZE = 4 ;


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




        /////////////////////
        ///  SCENE MEASURE
        /////////////////////

        let left = 0 ;
        let right = 0 ;
        let top = 0 ;

        scene.traverse( (obj)=> {

            if ( obj.type == 'Mesh' ) {

                if ( obj.position.x < left ) {

                    left = obj.position.x ;

                } else if ( obj.position.x > right ) {

                    right = obj.position.x ;

                };

                if ( obj.position.y > top ) {

                    top = obj.position.y ;

                };

            };

        });

        left -= 3 ;
        right += 3 ;
        top += 3 ;




        //////////////////////////////////////
        ///    CREATION OF CHUNKS AND EXPORT
        //////////////////////////////////////

        for ( let i = 0 ; i < top / CHUNKSIZE ; i ++ ) {

            let stage = new THREE.Group();

            for ( let j = scene.children.length - 1 ; j > -1 ; j--  ) {

                if ( scene.children[ j ].type == 'Mesh' &&
                     scene.children[ j ].position.y < (i + 1) * CHUNKSIZE ) {

                    stage.add( scene.children[ j ] );

                };

            };

            exportStage( stage, i );

            for ( let j = stage.children.length - 1 ; j > -1 ; j-- ) {

                scene.add( stage.children[ j ] );

            };

        };


        
        function exportStage( group, i ) {

            exporter.parse( group, (result)=> {

                var output = JSON.stringify( result, null, 2 );

                var file = new File([output], `sceneTiles-stage${ i }.gltf`, {type: "text/plain;charset=utf-8"});
                saveAs(file);

            } );

        };






        //////////////////////////////////
        ///  LINES CREATION AND EXPORT
        //////////////////////////////////


        setTimeout( ()=> {

            // create a group with the lines inside
            let lines = createLines();

            // export as GLTF
            exportLines( lines );

            // delete the lines
            for ( let i = lines.children.length - 1 ; i > -1 ; i-- ) {
                lines.children[ i ].geometry.dispose();
            };

        }, 1000);



        function exportLines( group ) {

            exporter.parse( group, (result)=> {

                var output = JSON.stringify( result, null, 2 );

                var file = new File([output], `sceneTiles-LINES.gltf`, {type: "text/plain;charset=utf-8"});
                saveAs(file);

            } );

        };



        function createLines() {

            let leftMostLine = 0 ;
            let rightMostLine = 0 ;
            let topMostLine = 0 ;

            var shapeMat = new THREE.MeshBasicMaterial( { color: 0xff0048 } );

            var group = new THREE.Group();


            while ( left < leftMostLine ||
                    right > rightMostLine ||
                    top > topMostLine  ) {


                if ( left < leftMostLine ) {

                    var shape = new THREE.Shape();

                    shape.moveTo( leftMostLine, 0 );
                    shape.lineTo( leftMostLine, top );
                    shape.lineTo( leftMostLine + 0.01, top );
                    shape.moveTo( leftMostLine + 0.01, 0 );

                    var geometry = new THREE.ShapeBufferGeometry( shape );
                    var mesh = new THREE.Mesh( geometry, shapeMat ) ;

                    group.add( mesh );

                    leftMostLine -= CHUNKSIZE ;

                };


                if ( right > rightMostLine ) {

                    var shape = new THREE.Shape();

                    shape.moveTo( rightMostLine, 0 );
                    shape.lineTo( rightMostLine, top );
                    shape.lineTo( rightMostLine + 0.01, top );
                    shape.moveTo( rightMostLine + 0.01, 0 );

                    var geometry = new THREE.ShapeBufferGeometry( shape );
                    var mesh = new THREE.Mesh( geometry, shapeMat ) ;

                    group.add( mesh );

                    rightMostLine += CHUNKSIZE ;

                };


                if ( top > topMostLine ) {

                    var shape = new THREE.Shape();

                    shape.moveTo( left, topMostLine );
                    shape.lineTo( right, topMostLine );
                    shape.lineTo( right, topMostLine + 0.01 );
                    shape.moveTo( left, topMostLine + 0.01 );

                    var geometry = new THREE.ShapeBufferGeometry( shape );
                    var mesh = new THREE.Mesh( geometry, shapeMat ) ;

                    group.add( mesh );

                    topMostLine += CHUNKSIZE ;

                };

            };

            return group ;

        };



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