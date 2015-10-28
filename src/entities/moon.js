var Moon = function(){

    this.geometry = null;
    this.material = null;
    this.mesh = null;
    this.rotationalCenter = null;
    this.rotationAngle = 0.0;
    var moonOrbitRotationSpeed = 0.2;
    this.init = function(x,y,z){
        this.geometry = new THREE.SphereGeometry(2, 32, 32);
        this.material = new THREE.MeshPhongMaterial();
        this.material.map = THREE.ImageUtils.loadTexture('assets/images/moonmap1k.jpg');
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.mesh.position.x = 15;
    };

    this.createGeometry = function(){};

    this.getMesh = function(){
        return this.mesh;
    };

    this.axialAngle = function(){

    };


    this.computeOrbit = function(moonMesh, earthMesh){
        var moonDistFromEarth = 12;

        var x = moonDistFromEarth * -Math.cos(this.rotationAngle * (Math.PI / 180));
        var z = moonDistFromEarth * -Math.sin(this.rotationAngle * (Math.PI / 180));
        this.rotationAngle-= moonOrbitRotationSpeed;

        moonMesh.position.x = earthMesh.position.x + x;
        moonMesh.position.z = earthMesh.position.z + z;

    };


};