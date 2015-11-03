var Moon = function(){

    this.geometry = null;
    this.material = null;
    this.mesh = null;

    this.init = function(x,y,z){
        this.geometry = new THREE.SphereGeometry(2, 32, 32);
        this.material = new THREE.MeshPhongMaterial();
        this.material.map = THREE.ImageUtils.loadTexture('assets/images/moonmap1k.jpg');
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.mesh.rotateX(0.42693043);
        this.mesh.castShadow = true;
        this.mesh.receiveShadow = true;
    };


    this.getMesh = function(){
        return this.mesh;
    };




};