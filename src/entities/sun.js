var Sun = function(){

    this.geometry = null;
    this.material = null;
    this.mesh = null;

    this.init = function(){
        this.geometry = new THREE.SphereGeometry(14, 32, 32);
        this.material = new THREE.MeshPhongMaterial();
        this.material.map = THREE.ImageUtils.loadTexture('assets/images/sunmap.jpg');
        this.mesh = new THREE.Mesh(this.geometry, this.material);

    };

    this.getMesh = function(){
        return this.mesh;
    };




};