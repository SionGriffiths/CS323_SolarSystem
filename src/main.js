
var Main = function(){

    var scene = null;
    var camera = null;
    var renderer = null;
    var earth = null;
    var sun = null;
    var moon = null;
    var globalVars = null;
    var earthRotationAngle = 0.0;
    var earthOrbitRotationSpeed = 0.2;

    this.initSim = function(){
        globalVars = new GlobalVars();
        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);
        camera.position.y = 50;
        camera.position.z = 50;
        camera.position.x = 50;
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
        eathRot(earth.getMesh(), sun.getMesh());
        //var  earthNorms = new THREE.FaceNormalsHelper( earth.getMesh(),3, 0x0000dd, 5);
        //scene.add(earthNorms);

    };

    var eathRot = function(earthMesh, sunMesh){
        var earthDistanceFromSun = 24;

        var x = earthDistanceFromSun * -Math.cos(earthRotationAngle * (Math.PI / 180));
        var z = earthDistanceFromSun * -Math.sin(earthRotationAngle * (Math.PI / 180));
        earthRotationAngle-= earthOrbitRotationSpeed;

        earthMesh.position.x = sunMesh.position.x + x;
        earthMesh.position.z = sunMesh.position.z + z;

    }


};