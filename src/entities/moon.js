var Moon = function(){

    this.geometry = null;
    this.material = null;
    this.mesh = null;
    this.rotationalCenter = null;

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
};