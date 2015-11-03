
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
    var shadowCastingLight = null;

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
        var ambientLight = new THREE.AmbientLight( 0xffffff , 0.2 );
        //scene.add(ambientLight);
        renderer = new THREE.WebGLRenderer( {antialias : true});
        renderer.setSize( window.innerWidth, window.innerHeight );
        renderer.shadowMapEnabled = true;
        document.body.appendChild( renderer.domElement );
        this.initEntities();
        var axisLength = 100;
        scene.add(makeLine(v(-axisLength, 0, 0), v(axisLength, 0, 0), 0xFF0000));
        scene.add(makeLine(v(0, -axisLength, 0), v(0, axisLength, 0), 0x00FF00));
        scene.add(makeLine(v(0, 0, -axisLength), v(0, 0, axisLength), 0x0000FF));
        shadowCastingLight = new THREE.SpotLight(0xffffff, 1);
        initShadowCam();
        scene.add(shadowCastingLight);
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
        earth.getMesh().add(makeLine( v(0, 15, 0), v(0, 0, 0), 0xaa00FF));
        earth.getMesh().add(makeLine( v(0, 0, 15), v(0, 0, 0), 0xFFaa00));
        earth.getMesh().add(makeLine( v(15, 0, 0), v(0, 0, 0), 0x00FFaa));
        earthOrbitPoints = orbitUtils.generateElliptical(0.12,3650,80);
        this.addToScene(earth.getMesh());
        moon = new Moon();
        moon.init();
        moon.getMesh().add(makeLine( v(0, 15, 0), v(0, 0, 0), 0xFF00aa));
        moon.getMesh().add(makeLine( v(0, 0, 15), v(0, 0, 0), 0xaaFF00));
        moon.getMesh().add(makeLine( v(15, 0, 0), v(0, 0, 0), 0x00aaFF));
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
        updateLight();

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
        //moon.getMesh().rotation.y  += 1/4 * delta;
        moon.getMesh().lookAt(earth.getMesh().position);
        moon.getMesh().position.x = earth.getMesh().position.x + moonOrbitPoints[moonCount].x;
        moon.getMesh().position.z = earth.getMesh().position.z + moonOrbitPoints[moonCount].z;

        moonCount += 1;
        if(moonCount >= moonOrbitPoints.length) {moonCount = 0;}

    };

var updateLight = function(){
  shadowCastingLight.target = earth.getMesh();
};
    function v(x,y,z){
        return new THREE.Vector3(x,y,z);
    }

    var makeLine = function(point1, point2, colour){
        var line, lineGeometry = new THREE.Geometry(),
            lineMat = new THREE.LineBasicMaterial({color: colour});
        lineGeometry.vertices.push(point1, point2);
        return new THREE.Line(lineGeometry, lineMat);
    };


    var initShadowCam = function(){
        shadowCastingLight.castShadow = true;
        shadowCastingLight.shadowDarkness = 0.7;
        shadowCastingLight.shadowCameraVisible = true;
        shadowCastingLight.shadowCameraNear = 20;
        shadowCastingLight.shadowCameraFar = 500;
        shadowCastingLight.shadowCameraLeft = -0.5;
        shadowCastingLight.shadowCameraRight = 0.5;
        shadowCastingLight.shadowCameraTop = 0.5;
        shadowCastingLight.shadowCameraBottom = -0.5;
        scene.add(shadowCastingLight);
    };

};