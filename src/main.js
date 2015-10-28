
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

    this.initSim = function(){
        globalVars = new GlobalVars();
        orbitUtils = new OrbitUtils();
        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);
        camera.position.y = 75;

        camera.position.z = 75;
        //camera.position.x = 50;
        camera.lookAt(scene.position);
        var ambientLight = new THREE.AmbientLight( 0xffffff );
        scene.add(ambientLight);
        renderer = new THREE.WebGLRenderer( {antialias : true});
        renderer.setSize( window.innerWidth, window.innerHeight );
        document.body.appendChild( renderer.domElement );
        //window.addEventListener( 'resize', onWindowResize, false );
        this.initEntities();
        debugaxis(100);

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
        earthOrbitPoints = orbitUtils.testEllipse(0.12,720,24);
        this.addToScene(earth.getMesh());
        moon = new Moon();
        moon.init();
        moonOrbitPoints = orbitUtils.testEllipse(0.5, 280, 10);
        this.addToScene(moon.getMesh());
test();
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
            color: 0x0000ff
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
        earth.getMesh().rotation.y  += 1/2 * delta;
        //earth.computeOrbit(earth.getMesh(), sun.getMesh());

        earth.getMesh().position.x = earthOrbitPoints[count].x;
        earth.getMesh().position.z = earthOrbitPoints[count].y;
        //orbitUtils.computeOrbit(earth, sun.getMesh(), 24, 0.2);
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
        moon.getMesh().position.x =  moonOrbitPoints[moonCount].x;
        moon.getMesh().position.z =  moonOrbitPoints[moonCount].y;

        moonCount++;
        if(moonCount == 560) {moonCount = 0;}
        //moon.computeOrbit(moon.getMesh(),earth.getMesh());
    };
};