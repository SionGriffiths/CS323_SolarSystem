
var Main = function(){

    var camera,renderer,earth,sun,moon,globalVars,orbitUtils,
        moonOrbitPoints,matrixUtils,shadowCastingLight,
        controls,ambientLight,gui,geometryTools,sceneAxisX,
        sceneAxisY,sceneAxisZ,earthAxis,moonAxis;
    var ambientIntensityInitial = 1;


    var guiVars = {
        ambientLightIntensity : 1,
        moonOrbitTrace : false,
        earthOrbitTrace : false,
        removeSun : false,
        paused : false,
        sceneAxes : false,
        earthAxis : false,
        moonAxis : false,
        simSpeed : 1
    };

    this.initSim = function(){
        globalVars = new GlobalVars();
        orbitUtils = new OrbitUtils();
        matrixUtils = new MatrixUtils();
        geometryTools = new GeometryTools();
        globalVars.scene = new THREE.Scene();
        initCamera();
        initSceneAxes(100);
        ambientLight = new THREE.AmbientLight( 0xffffff );
        addToScene(ambientLight);
        initRenderer();
        initControls();
        this.initEntities();

        shadowCastingLight = new THREE.SpotLight(0xffffff, 1);
        initShadowCam();
        addToScene(shadowCastingLight);
        gui = initGUI();
    };

    this.startSim = function(){
        (function drawFrame(){
            stats.begin();
            if(guiVars.paused) {
                render();
                pausedEnabledUpdates();
                window.requestAnimationFrame(drawFrame);
                return;
            }
            update();
            render();
            stats.end();
            window.requestAnimationFrame(drawFrame);
        }());
    };
    var initRenderer = function(){
        renderer = new THREE.WebGLRenderer( {antialias : true});
        renderer.setSize( window.innerWidth, window.innerHeight );
        renderer.shadowMap.enabled = true;
        document.body.appendChild( renderer.domElement );
        window.addEventListener( 'resize', onWindowResize, false );
    };
    var initControls = function(){
        controls = new THREE.OrbitControls( camera, renderer.domElement );
        controls.enableDamping = true;
        controls.dampingFactor = 0.25;
        controls.enableZoom = true;
    };
    var addToScene = function(entity){
        globalVars.scene.add(entity);
    };

    var removeFromScene = function(entity){
        globalVars.scene.remove(entity)
    };

    this.initEntities = function(){
        sun = new Sun();
        sun.init();
        addToScene(sun.getMesh());
        earth = new Earth();
        earth.init(globalVars,guiVars);
        earthAxis = (geometryTools.makeLine( geometryTools.vec3(0, 15, 0), geometryTools.vec3(0, -15, 0), 0xaa00FF));
        earth.orbitPoints = orbitUtils.generateElliptical(0.12,3650,80,0);
        earth.orbitPlot = orbitUtils.plotOrbit(earth.orbitPoints,0x00aaFF);
        addToScene(earth.getMesh());
        moon = new Moon();
        moon.init();
        moonAxis = (geometryTools.makeLine( geometryTools.vec3(0, 0, 10), geometryTools.vec3(0, 0, -10), 0xE0E54E));
        moon.orbitPoints = orbitUtils.generateElliptical(0.3, 280, 15, -5.145);
        moon.orbitPlot = orbitUtils.plotOrbit(moon.orbitPoints,0xb2b2b2);
        addToScene(moon.getMesh());
        camera.lookAt(earth.getMesh().position);
    };

    var render = function(){
        renderer.render(globalVars.scene, camera);
    };

    var initSceneAxes = function(axisLength){
        sceneAxisX = (geometryTools.makeLine(geometryTools.vec3(-axisLength, 0, 0), geometryTools.vec3(axisLength, 0, 0), 0xFF0000));
        sceneAxisY = (geometryTools.makeLine(geometryTools.vec3(0, -axisLength, 0), geometryTools.vec3(0, axisLength, 0), 0x00FF00));
        sceneAxisZ = (geometryTools.makeLine(geometryTools.vec3(0, 0, -axisLength), geometryTools.vec3(0, 0, axisLength), 0xFF00aa));
    };

    var stats = new Stats();
    stats.setMode( 1 ); // 0: fps, 1: ms, 2: mb

// align top-left
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.left = '0px';
    stats.domElement.style.top = '0px';

    document.body.appendChild( stats.domElement );

    var update = function(){
        earth.update(globalVars);
        sun.update(globalVars,guiVars);
        moon.update(globalVars,earth);
        pausedEnabledUpdates();
    };

    var pausedEnabledUpdates = function(){
        updateLight();
        UpdateGUIVars();
        updateAxes();
        earth.updateOrbitPlots(guiVars,globalVars);
        moon.updateOrbitPlots(guiVars,globalVars,earth);
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

    var updateAxes = function(){
        if(guiVars.sceneAxes){
            addToScene(sceneAxisX);
            addToScene(sceneAxisY);
            addToScene(sceneAxisZ);
        }else{
            removeFromScene(sceneAxisX);
            removeFromScene(sceneAxisY);
            removeFromScene(sceneAxisZ);
        }
        if(guiVars.earthAxis){
            earth.setAxisLine(earthAxis);
        }else{
            earth.removeAxisLine(earthAxis);
        }
        if(guiVars.moonAxis){
            moon.setAxisLine(moonAxis);
        }else{
            moon.removeAxisLine(moonAxis);
        }
    };

    var updateCameraPosition = function(x,y,z){
        camera.position.x = x;
        camera.position.y = y;
        camera.position.z = z;
    };
    var initCamera = function(){
        camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);
        updateCameraPosition(125,0,125);
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
        addToScene(shadowCastingLight);
    };

    var initGUI = function(){
        var gui = new dat.GUI();
        gui.add(guiVars, 'simSpeed');
        gui.add(guiVars, 'ambientLightIntensity');
        gui.add(guiVars, 'paused');
        gui.add(guiVars, 'moonOrbitTrace');
        gui.add(guiVars, 'earthOrbitTrace');
        gui.add(guiVars, 'removeSun');
        gui.add(guiVars, 'sceneAxes');
        gui.add(guiVars, 'earthAxis');
        gui.add(guiVars, 'moonAxis');
        return gui;
    };

    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
        render();
    }
};