
var Main = function(){

    var scene = null;
    var camera = null;
    var renderer = null;
    var earth = null;
    var sun = null;
    var moon = null;
    var globalVars = null;
    var orbitUtils = null;
    var earthOrbitPoints = null;
    var moonOrbitPoints = null;
    var matrixUtils = null;

    this.initSim = function(){
        globalVars = new GlobalVars();
        orbitUtils = new OrbitUtils();
        matrixUtils = new MatrixUtils();
        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);
        camera.position.y = 125;
        camera.position.z = 125;
        camera.position.x = 125;
        camera.lookAt(scene.position);
        var ambientLight = new THREE.AmbientLight( 0xffffff );
        scene.add(ambientLight);
        renderer = new THREE.WebGLRenderer( {antialias : true});
        renderer.setSize( window.innerWidth, window.innerHeight );
        document.body.appendChild( renderer.domElement );
        //window.addEventListener( 'resize', onWindowResize, false );
        this.initEntities();
        debugaxis(100);
        console.log(matrixUtils.matMulti());
        //test();
    };

    this.startSim = function(){
        var clock = new THREE.Clock();
        (function drawFrame(){
            var delta = clock.getDelta();
            update(delta);
            render();
            window.requestAnimationFrame(drawFrame);
        }());
    };

    this.addToScene = function(entity){
        scene.add(entity);
    };

    this.initEntities = function(){
        sun = new Sun();
        sun.init();
        this.addToScene(sun.getMesh());
        earth = new Earth();
        earth.init();
        earth.getMesh().add(makeLine( v(0, 33, 0), v(0, -33, 0), 0xaa00FF));
        earthOrbitPoints = orbitUtils.generateElliptical(0.12,3650,40);
        this.addToScene(earth.getMesh());

        moon = new Moon();
        moon.init();
        moonOrbitPoints = orbitUtils.generateElliptical(0.3, 280, 15);
        this.addToScene(moon.getMesh());
//test();
    };

    var render = function(){
        renderer.render(scene, camera);
    };


    var update = function(delta){

        updateEarth(delta);
        updateSun(delta);
        updateMoon(delta);


    };

    var debugaxis = function(axisLength){
        //Shorten the vertex function
        function v(x,y,z){
            return new THREE.Vector3(x,y,z);
        }
        //Create axis (point1, point2, colour)
        function createAxis(p1, p2, color){
            var line, lineGeometry = new THREE.Geometry(),
                lineMat = new THREE.LineBasicMaterial({color: color, lineWidth: 1});
            lineGeometry.vertices.push(p1, p2);
            line = new THREE.Line(lineGeometry, lineMat);
            scene.add(line);
        }
        createAxis(v(-axisLength, 0, 0), v(axisLength, 0, 0), 0xFF0000);
        createAxis(v(0, -axisLength, 0), v(0, axisLength, 0), 0x00FF00);
        createAxis(v(0, 0, -axisLength), v(0, 0, axisLength), 0x0000FF);
    };

    var test = function(){
        console.log(moonOrbitPoints);

        var material = new THREE.LineBasicMaterial({
            color: 0xffffff
        });
        var geometry = new THREE.Geometry();
        for(var i = 0; i < moonOrbitPoints.length; i++ ){
            geometry.vertices.push(moonOrbitPoints[i]);
        }

        var line = new THREE.Line(geometry, material);

        scene.add(line);
    };

    var count = 0;
    var updateEarth = function(delta){

        earth.getMesh().rotation.y  += delta;
        earth.getMesh().position.z = earthOrbitPoints[count].z;
        earth.getMesh().position.x = earthOrbitPoints[count].x;

        count ++;
        if(count >= earthOrbitPoints.length){
            count = 0;
        }
    };

    var updateSun = function(delta){
        sun.getMesh().rotation.y += 1/64 *delta;
    };



    var moonCount = 0;
    var updateMoon = function(delta){
        moon.getMesh().rotation.y  += 1/4 * delta;
        moon.getMesh().position.x = earth.getMesh().position.x + moonOrbitPoints[moonCount].x;
        moon.getMesh().position.z = earth.getMesh().position.z + moonOrbitPoints[moonCount].z;

        moonCount += 1;
        if(moonCount >= moonOrbitPoints.length) {moonCount = 0;}

    };


    function v(x,y,z){
        return new THREE.Vector3(x,y,z);
    }

    var makeLine = function(point1, point2, colour){
        var line, lineGeometry = new THREE.Geometry(),
            lineMat = new THREE.LineBasicMaterial({color: colour, lineWidth: 1});
        lineGeometry.vertices.push(point1, point2);
        return new THREE.Line(lineGeometry, lineMat);
    };


};