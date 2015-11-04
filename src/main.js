
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
    var controls = null;
    var ambientIntensityInitial = 1;
    var ambientLight = null;
    var gui;
    var simSpeed = 1;
    var earthRotationSpeed = 0.5;
    var earthPlot = null;
    var moonPlot = null;
    //var paused = false;
    var guiVars = {

        ambientLightIntensity : 1,
        moonOrbitTrace : false,
        paused : false,
        simSpeed : 1
    };

    this.initSim = function(){
        globalVars = new GlobalVars();
        orbitUtils = new OrbitUtils();
        matrixUtils = new MatrixUtils();
        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);
        //camera.position.y = 125;
        camera.position.z = 125;
        camera.position.x = 125;
        ambientLight = new THREE.AmbientLight( 0xffffff );
        scene.add(ambientLight);
        renderer = new THREE.WebGLRenderer( {antialias : true});
        renderer.setSize( window.innerWidth, window.innerHeight );
        renderer.shadowMap.enabled = true;
        document.body.appendChild( renderer.domElement );
        window.addEventListener( 'resize', onWindowResize, false );
        controls = new THREE.OrbitControls( camera, renderer.domElement );
        controls.enableDamping = true;
        controls.dampingFactor = 0.25;
        controls.enableZoom = true;
        this.initEntities();
        var axisLength = 100;
        scene.add(makeLine(v(-axisLength, 0, 0), v(axisLength, 0, 0), 0xFF0000));
        scene.add(makeLine(v(0, -axisLength, 0), v(0, axisLength, 0), 0x00FF00));
        scene.add(makeLine(v(0, 0, -axisLength), v(0, 0, axisLength), 0x0000FF));
        shadowCastingLight = new THREE.SpotLight(0xffffff, 1);
        initShadowCam();
        scene.add(shadowCastingLight);
        gui = initGUI();
    };

    this.startSim = function(){
        var clock = new THREE.Clock();
        (function drawFrame(){

            if(guiVars.paused) {
                render();
                requestAnimationFrame(drawFrame);
                return;
            }


            update();
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
        earth.getMesh().add(makeLine( v(0, 15, 0), v(0, -15, 0), 0xaa00FF));
        //earth.getMesh().add(makeLine( v(0, 0, 15), v(0, 0, 0), 0xFFaa00));
        //earth.getMesh().add(makeLine( v(15, 0, 0), v(0, 0, 0), 0x00FFaa));
        earthOrbitPoints = orbitUtils.generateElliptical(0.12,3650,80,0);
        earthPlot = plotOrbit(earthOrbitPoints);
        this.addToScene(earth.getMesh());
        moon = new Moon();
        moon.init();
        //moon.getMesh().add(makeLine( v(0, 15, 0), v(0, 0, 0), 0xFF00aa));
        moon.getMesh().add(makeLine( v(0, 0, 10), v(0, 0, -10), 0xaaFF00));
        //moon.getMesh().add(makeLine( v(15, 0, 0), v(0, 0, 0), 0x00aaFF));
        moonOrbitPoints = orbitUtils.generateElliptical(0.3, 280, 15, 5.145);
        moonPlot = plotOrbit(moonOrbitPoints);
        this.addToScene(moon.getMesh());
        camera.lookAt(earth.getMesh().position);

    };

    var render = function(){
        renderer.render(scene, camera);
    };


    var update = function(){
        updateEarth();
        updateSun();
        updateMoon();
        updateLight();
        UpdateGUIVars();
    };

    var plotOrbit = function(orbitPoints){
        var material = new THREE.LineBasicMaterial({
            color: 0xffffff
        });
        var geometry = new THREE.Geometry();
        for(var i = 0; i < orbitPoints.length; i++ ){
            geometry.vertices.push(orbitPoints[i]);
        }

        return new THREE.Line(geometry, material);
    };

    var count = 0;
    var updateEarth = function(){

        earth.getMesh().rotation.y  += (earthRotationSpeed*simSpeed)*0.1;
        earth.getMesh().position.z = earthOrbitPoints[count].z;
        earth.getMesh().position.x = earthOrbitPoints[count].x;

        count += 1 * simSpeed;
        if(count >= earthOrbitPoints.length){
            count = 0;
        }
    };

    var updateSun = function(){
        sun.getMesh().rotation.y += 1/64 *simSpeed;
    };

    var moonCount = 0;
    var updateMoon = function(){
        //moon.getMesh().rotation.y  += 1/4 * delta;
        moon.getMesh().lookAt(earth.getMesh().position);
        moon.getMesh().position.x = earth.getMesh().position.x + moonOrbitPoints[moonCount].x;
        moon.getMesh().position.z = earth.getMesh().position.z + moonOrbitPoints[moonCount].z;
        moon.getMesh().position.y = earth.getMesh().position.y + moonOrbitPoints[moonCount].y;

        moonCount += 1*simSpeed;
        if(moonCount >= moonOrbitPoints.length) {moonCount = 0;}

        if(guiVars.moonOrbitTrace){
            scene.add(moonPlot);
            moonPlot.position.x = earth.getMesh().position.x;
            moonPlot.position.z = earth.getMesh().position.z;
        }else{
            scene.remove(moonPlot);
        }

    };

    var updateLight = function(){
        shadowCastingLight.target = earth.getMesh();
        ambientLight.color.setRGB(ambientIntensityInitial,ambientIntensityInitial,ambientIntensityInitial);
    };

    var UpdateGUIVars = function(){
        ambientIntensityInitial = guiVars.ambientLightIntensity;
        if(simSpeed != guiVars.simSpeed) {
            simSpeed = guiVars.simSpeed;
        }

    };

    function v(x,y,z){
        return new THREE.Vector3(x,y,z);
    }

    var makeLine = function(point1, point2, colour){
        var lineGeometry = new THREE.Geometry(),
            lineMat = new THREE.LineBasicMaterial({color: colour});
        lineGeometry.vertices.push(point1, point2);
        return new THREE.Line(lineGeometry, lineMat);
    };


    var initShadowCam = function(){
        shadowCastingLight.castShadow = true;
        shadowCastingLight.shadowDarkness = 0.7;
        shadowCastingLight.shadowCameraVisible = false;
        shadowCastingLight.shadowCameraNear = 20;
        shadowCastingLight.shadowCameraFar = 500;
        shadowCastingLight.shadowCameraLeft = -0.5;
        shadowCastingLight.shadowCameraRight = 0.5;
        shadowCastingLight.shadowCameraTop = 0.5;
        shadowCastingLight.shadowCameraBottom = -0.5;
        scene.add(shadowCastingLight);
    };


    var initGUI = function(){
        var gui = new dat.GUI();
        gui.add(guiVars, 'ambientLightIntensity');
        gui.add(guiVars, 'paused');
        gui.add(guiVars, 'moonOrbitTrace');
        gui.add(guiVars, 'simSpeed');

        return gui;
    };

    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
        render();
    }

};