
var Main = function(){

    var camera,renderer,earth,sun,moon,globalVars,orbitUtils,shadowLight,
        controls,ambientLight,gui,sceneAxes = [],earthAxis = [],moonAxes = [],ambientIntensityInitial = 1;

    var guiVars = {
        ambientLightIntensity : 0.2,
        moonOrbitTrace : false,
        earthOrbitTrace : false,
        removeSun : false,
        paused : false,
        sceneAxes : false,
        earthAxes : false,
        moonAxes : false,
        shadowCam : false,
        simSpeed : 1
    };

    this.initSim = function(){
        globalVars = new GlobalVars();
        orbitUtils = new OrbitUtils();
        globalVars.scene = new THREE.Scene();
        initCamera();
        initSceneAxes(100);
        ambientLight = new THREE.AmbientLight(0xffffff);
        addToScene(ambientLight);
        initRenderer();
        initControls();
        initEntities();
        shadowLight = new THREE.SpotLight(0xffffff, 1);
        initShadowCam();
        addToScene(shadowLight);
        gui = initGUI();
    };

    this.startSim = function(){
        (function drawFrame(){
            if(guiVars.paused) {
                render();
                pausedEnabledUpdates();
                window.requestAnimationFrame(drawFrame);
                return;
            }
            update();
            render();
            window.requestAnimationFrame(drawFrame);
        }());
    };

    var initRenderer = function(){
        renderer = new THREE.WebGLRenderer( {antialias : true});
        renderer.setSize( window.innerWidth, window.innerHeight );
        renderer.shadowMap.enabled = true;
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

    var initEntities = function(){
        var pointList = orbitUtils.generateElliptical(0.12,globalVars.earthYear,80);
        globalVars.numIterationsInYear = pointList.length;
        sun = new Sun();
        sun.init(globalVars);
        addToScene(sun.getMesh());
        earth = new Earth();
        earth.orbitPoints = pointList;
        earth.init(globalVars,guiVars);
        earthAxis = makeLines(15, false, 0x00AFFA, 0xFA00AF, 0xAFFA00);
        earth.orbitPlot = orbitUtils.plotOrbit(earth.orbitPoints,0xffd3ff);
        addToScene(earth.getMesh());
        moon = new Moon();
        moon.init();
        moonAxes = makeLines(10,false,0x59242A, 0xF2B96E, 0x647D50);
        moon.orbitPoints = orbitUtils.applyTiltToOrbit(-5.145,orbitUtils.generateElliptical(0.5, 273.2, 10));
        moon.orbitPlot = orbitUtils.plotOrbit(moon.orbitPoints,0xb2b2b2);
        addToScene(moon.getMesh());
        addToScene(initSkyBox());
    };

    var render = function(){
        renderer.render(globalVars.scene, camera);
    };

    var initSceneAxes = function(axisLength){
        sceneAxes = makeLines(axisLength, true, 0x5CA788, 0xD4D35D, 0xEF6A6B);
    };

    var update = function(){
        earth.update(globalVars);
        sun.update(guiVars);
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
        console.log(guiVars.shadowCam);
        ambientIntensityInitial = guiVars.ambientLightIntensity;
        if(globalVars.simSpeed != guiVars.simSpeed) {
            globalVars.simSpeed = guiVars.simSpeed;
        }
        if(guiVars.shadowCam){
            addToScene(shadowLight.helper);
        }else{
            removeFromScene(shadowLight.helper);
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
        updateCameraPosition(200,200,200);
    };

    var initShadowCam = function(){
        shadowLight.castShadow = true;
        shadowLight.shadowDarkness = 0.5;
        shadowLight.helper = new THREE.CameraHelper( shadowLight.shadow.camera );
        shadowLight.shadowCameraLeft = -0.5;
        shadowLight.shadowCameraRight = 0.5;
        shadowLight.shadowCameraTop = 0.5;
        shadowLight.shadowCameraBottom = -0.5;
        addToScene(shadowLight);
    };

    var initGUI = function(){
        var gui = new dat.GUI();
        gui.add(guiVars, 'simSpeed').min(1).max(50).step(1).name('Sim Speed');
        gui.add(guiVars, 'ambientLightIntensity').min(0).max(1).step(0.1).name('Ambient Light Value');
        gui.add(guiVars, 'paused').name('Pause');
        gui.add(guiVars, 'moonOrbitTrace').name('Trace Moon Orbit');
        gui.add(guiVars, 'earthOrbitTrace').name('Trace Earth Orbit');
        gui.add(guiVars, 'removeSun').name('Toggle Sun');
        gui.add(guiVars, 'sceneAxes').name('Toggle Scene Axes');
        gui.add(guiVars, 'earthAxes').name('Toggle Earth Axes');
        gui.add(guiVars, 'moonAxes').name('Toggle Moon Axes');
        gui.add(guiVars, 'shadowCam').name('Toggle Shadow Cam');
        return gui;
    };

    var onWindowResize = function(){
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
        render();
    };

    var initSkyBox = function(){
        var geom = new THREE.SphereGeometry(500, 60, 40);
        var mat = new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load("assets/images/starmap.png")});
        mat.side = THREE.BackSide;
        return new THREE.Mesh(geom, mat);
    }

};

