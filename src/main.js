
var Main = function(){

    var camera,renderer,earth,sun,moon,globalVars,orbitUtils,
        matrixUtils,shadowLight,
        controls,ambientLight,gui,geometryTools,sceneAxes = [],earthAxis = [],moonAxes = [],ambientIntensityInitial = 1;



    var guiVars = {
        ambientLightIntensity : 1,
        moonOrbitTrace : false,
        earthOrbitTrace : false,
        removeSun : false,
        paused : false,
        sceneAxes : false,
        earthAxes : false,
        moonAxes : false,
        simSpeed : 1
    };

    this.initSim = function(){
        globalVars = new GlobalVars();
        matrixUtils = new MatrixUtils();
        orbitUtils = new OrbitUtils(matrixUtils);
        geometryTools = new GeometryTools();
        globalVars.scene = new THREE.Scene();
        initCamera();
        initSceneAxes(100);
        ambientLight = new THREE.AmbientLight(0xffffff);
        addToScene(ambientLight);
        initRenderer();
        initControls();
        this.initEntities();
        shadowLight = new THREE.SpotLight(0xffffff, 1);
        initShadowCam();
        addToScene(shadowLight);
        gui = initGUI();
    };

    this.startSim = function(){
        (function drawFrame(){
            //stats.begin();
            if(guiVars.paused) {
                render();
                pausedEnabledUpdates();
                window.requestAnimationFrame(drawFrame);
                return;
            }

            update();
            render();
            //stats.end();
            window.requestAnimationFrame(drawFrame);
        }());
    };

    var initRenderer = function(){
        renderer = new THREE.WebGLRenderer( {antialias : true});
        renderer.setSize( window.innerWidth, window.innerHeight );
        renderer.shadowMap.enabled = true;
        //document.body.appendChild( renderer.domElement );
        $("#scene").append(renderer.domElement);
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
        earthAxis = geometryTools.makeLines(15, false, 0x00AFFA, 0xFA00AF, 0xAFFA00);
        earth.orbitPoints = orbitUtils.generateElliptical(0.12,3650,80,0);
        earth.orbitPlot = orbitUtils.plotOrbit(earth.orbitPoints,0xffd3ff);
        addToScene(earth.getMesh());
        moon = new Moon();
        moon.init();
        moonAxes = geometryTools.makeLines(10,false,0x59242A, 0xF2B96E, 0x647D50);
        moon.orbitPoints = orbitUtils.generateElliptical(0.3, 280, 10, -5.145);
        moon.orbitPlot = orbitUtils.plotOrbit(moon.orbitPoints,0xb2b2b2);
        addToScene(moon.getMesh());
        camera.lookAt(earth.getMesh().position);
    };

    var render = function(){
        renderer.render(globalVars.scene, camera);
    };

    var initSceneAxes = function(axisLength){
        sceneAxes = geometryTools.makeLines(axisLength, true, 0x5CA788, 0xD4D35D, 0xEF6A6B);
    };

    var update = function(){
        earth.update(globalVars);
        //sun.getMesh().applyMatrix(matrixUtils.getYRotationMatrix(orbitUtils.radianOrbitalStep(27*30)));
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
        shadowLight.target = earth.getMesh();
        ambientLight.color.setRGB(ambientIntensityInitial,ambientIntensityInitial,ambientIntensityInitial);
    };

    var UpdateGUIVars = function(){
        ambientIntensityInitial = guiVars.ambientLightIntensity;
        if(globalVars.simSpeed != guiVars.simSpeed) {
            if(guiVars.simSpeed < 0){
                globalVars.simSpeed = 0.01;
            }else {
                globalVars.simSpeed = guiVars.simSpeed;
            }
        }
    };

    var updateAxes = function(){
        if(guiVars.sceneAxes){
            $.each( sceneAxes, function( key, line ) {
                addToScene(line);
            });
        }else{
            $.each( sceneAxes, function( key, line ) {
               removeFromScene(line);
            });
        }
        if(guiVars.earthAxes){
            earth.setAxisLine(earthAxis);
        }else{
            earth.removeAxisLine(earthAxis);
        }
        if(guiVars.moonAxes){
            moon.setAxisLine(moonAxes);
        }else{
            moon.removeAxisLine(moonAxes);
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
        shadowLight.castShadow = true;
        shadowLight.shadowDarkness = 0.7;
        shadowLight.shadowCameraVisible = false;
        shadowLight.shadowCameraLeft = -0.5;
        shadowLight.shadowCameraRight = 0.5;
        shadowLight.shadowCameraTop = 0.5;
        shadowLight.shadowCameraBottom = -0.5;
        addToScene(shadowLight);
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
        gui.add(guiVars, 'earthAxes');
        gui.add(guiVars, 'moonAxes');
        return gui;
    };

   var onWindowResize = function(){
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
        render();
    };

//
//    var stats = new Stats();
//    stats.setMode( 1 ); // 0: fps, 1: ms, 2: mb
//
//// align top-left
//    stats.domElement.style.position = 'absolute';
//    stats.domElement.style.left = '0px';
//    stats.domElement.style.top = '0px';
//
//    document.body.appendChild( stats.domElement );

};