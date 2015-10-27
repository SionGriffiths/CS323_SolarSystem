var Earth = function(){

    this.geometry = null;
    this.material = null;
    this.mesh = null;
    this.rotationalCenter = null;

    this.init = function(x,y,z){
        this.geometry = new THREE.SphereGeometry(4, 128, 128);
        this.material = new THREE.MeshPhongMaterial();
        this.material.map = THREE.ImageUtils.loadTexture('assets/images/earthmap1k.jpg');
        this.material.bumpMap = THREE.ImageUtils.loadTexture('assets/images/earthbump1k.jpg');
        this.material.bumpScale = 0.1;
        this.mesh = new THREE.Mesh(this.geometry, this.material);
    };

    this.createGeometry = function(){};

    this.getMesh = function(){
      return this.mesh;
    };

    this.axialAngle = function(){

    };
};