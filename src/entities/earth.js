var Earth = function(){

    this.geometry = null;
    this.material = null;
    this.mesh = null;
    this.rotationalCenter = null;
    this.rotationAngle = 0.0;
    var earthOrbitRotationSpeed = 0.01;

    this.init = function(x,y,z){
        this.geometry = new THREE.SphereGeometry(4, 128, 128);
        this.material = new THREE.MeshPhongMaterial();
        this.material.map = THREE.ImageUtils.loadTexture('assets/images/earthmap1k.jpg');
        this.material.bumpMap = THREE.ImageUtils.loadTexture('assets/images/earthbump1k.jpg');
        this.material.bumpScale = 0.1;
        this.mesh = new THREE.Mesh(this.geometry, this.material);

        this.mesh.rotation.y = 0.4101524;

        //this.mesh.add(this.drawAxis());

    };

    this.createGeometry = function(){};

    this.getMesh = function(){
      return this.mesh;
    };

    this.axialAngle = function(){

    };

    //this.drawAxis = function(){
    //    var line, lineGeometry = new THREE.Geometry(),
    //        lineMat = new THREE.LineBasicMaterial({color: 0xffffff});
    //    lineGeometry.vertices.push(0, 0);
    //    line = new THREE.Line(lineGeometry, lineMat);
    //    return line;
    //};

     this.computeOrbit = function(earthMesh, sunMesh){
        var earthDistanceFromSun = 24;

        var x = earthDistanceFromSun * -Math.cos(this.rotationAngle * (Math.PI / 180));
        var z = earthDistanceFromSun * -Math.sin(this.rotationAngle * (Math.PI / 180));
        this.rotationAngle-= earthOrbitRotationSpeed;

        earthMesh.position.x = sunMesh.position.x + x;
        earthMesh.position.z = sunMesh.position.z + z;

    };




};