
var Main = function(){

    var camera,renderer,earth,sun,moon,globalVars,orbitUtils,
        moonOrbitPoints,matrixUtils,shadowCastingLight,
        controls,ambientLight,gui,moonPlot;
    var ambientIntensityInitial = 1;


    var guiVars = {
        ambientLightIntensity : 1,
        moonOrbitTrace : false,
        earthOrbitTrace : false,
        removeSun : false,
        paused : false,
        simSpeed : 1
    };

    this.initSim = function(){
        globalVars = new GlobalVars();
        orbitUtils = new OrbitUtils();
        matrixUtils = new MatrixUtils();
        globalVars.scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);
        //camera.position.y = 125;
        camera.position.z = 125;
        camera.position.x = 125;
        ambientLight = new THREE.AmbientLight( 0xffffff );
        globalVars.scene.add(ambientLight);
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
        globalVars.scene.add(makeLine(v(-axisLength, 0, 0), v(axisLength, 0, 0), 0xFF0000));
        globalVars.scene.add(makeLine(v(0, -axisLength, 0), v(0, axisLength, 0), 0x00FF00));
        globalVars.scene.add(makeLine(v(0, 0, -axisLength), v(0, 0, axisLength), 0xFF00aa));
        shadowCastingLight = new THREE.SpotLight(0xffffff, 1);
        initShadowCam();
        globalVars.scene.add(shadowCastingLight);
        gui = initGUI();
    };

    this.startSim = function(){

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
        globalVars.scene.add(entity);
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
        earth.orbitPoints = orbitUtils.generateElliptical(0.12,3650,80,0);
        earth.orbitPlot = orbitUtils.plotOrbit(earth.orbitPoints,0x00aaFF);
        this.addToScene(earth.getMesh());
        moon = new Moon();
        moon.init();
        //moon.getMesh().add(makeLine( v(0, 15, 0), v(0, 0, 0), 0xFF00aa));
        moon.getMesh().add(makeLine( v(0, 0, 10), v(0, 0, -10), 0xaaFF00));
        //moon.getMesh().add(makeLine( v(15, 0, 0), v(0, 0, 0), 0x00aaFF));
        moon.orbitPoints = orbitUtils.generateElliptical(0.3, 280, 15, 5.145);
        moon.orbitPlot = orbitUtils.plotOrbit(moon.orbitPoints);
        this.addToScene(moon.getMesh());
        camera.lookAt(earth.getMesh().position);

    };

    var render = function(){
        renderer.render(globalVars.scene, camera);
    };


    var update = function(){
        earth.update(globalVars,guiVars);
        sun.update(globalVars,guiVars);
        moon.update(globalVars,guiVars,earth);
        updateLight();
        UpdateGUIVars();
        //debugText("Earth : " + globalVars.numEarthOrbits.toString() + "  \n Moon : " + globalVars.numMoonOrbits.toString());
    };

    var updateLight = function(){
        shadowCastingLight.target = earth.getMesh();
        ambientLight.color.setRGB(ambientIntensityInitial,ambientIntensityInitial,ambientIntensityInitial);
    };

    var UpdateGUIVars = function(){
        ambientIntensityInitial = guiVars.ambientLightIntensity;
        if(globalVars.simSpeed != guiVars.simSpeed) {
            if(guiVars.simSpeed < 0){
                globalVars.simSpeed = 0.1;
            }else {
                globalVars.simSpeed = guiVars.simSpeed;
            }
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
        globalVars.scene.add(shadowCastingLight);
    };

    var initGUI = function(){
        var gui = new dat.GUI();
        gui.add(guiVars, 'ambientLightIntensity');
        gui.add(guiVars, 'paused');
        gui.add(guiVars, 'moonOrbitTrace');
        gui.add(guiVars, 'earthOrbitTrace');
        gui.add(guiVars, 'removeSun');
        gui.add(guiVars, 'simSpeed');
        return gui;
    };

    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
        render();
    }

    var debugText = function(text){
        var text2 = document.createElement('div');
        text2.style.position = 'absolute';
        //text2.style.zIndex = 1;    // if you still don't see the label, try uncommenting this
        text2.style.width = 100;
        text2.style.height = 100;
        text2.style.backgroundColor = "blue";
        text2.innerHTML = text;
        text2.style.top = 200 + 'px';
        text2.style.left = 200 + 'px';
        document.body.appendChild(text2);
    }

};