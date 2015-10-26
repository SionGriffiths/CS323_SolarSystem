
var Main = function(){

    var scene = null;
    var camera = null;
    var renderer = null;
    var earth = null;
    var sun = null;
    var moon = null;
    var globalVars = null;

    this.initSim = function(){
        globalVars = new GlobalVars();
        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);
        camera.position.y = 75;
        camera.position.z = 150;
        camera.lookAt(scene.position);
        var ambientLight = new THREE.AmbientLight( 0xffffff );
        scene.add(ambientLight);
        renderer = new THREE.WebGLRenderer( {antialias : true});
        renderer.setSize( window.innerWidth, window.innerHeight );
        document.body.appendChild( renderer.domElement );
        //window.addEventListener( 'resize', onWindowResize, false );
        this.initEntities();
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
        this.addToScene(earth.getMesh());
        moon = new Moon();
        moon.init();
        this.addToScene(moon.getMesh());
        console.log(sun.getCenterVector());
    };

    var render = function(){
        renderer.render(scene, camera);
    };


    var update = function(delta){
        earth.getMesh().rotation.y  += 1/32 * delta;
        sun.getMesh().rotation.y += 1/64 *delta;
    };


};