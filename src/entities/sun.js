var Sun = function(){

    this.geometry = null;
    this.material = null;
    this.mesh = null;

    this.init = function(){
        this.geometry = new THREE.SphereGeometry(14, 32, 32);
        this.material = new THREE.MeshBasicMaterial();
        this.material.map = THREE.ImageUtils.loadTexture('assets/images/sunmap.jpg');
        this.mesh = new THREE.Mesh(this.geometry, this.material);
    };

    this.getMesh = function(){
        return this.mesh;
    };

    this.update = function(globalVars,guiVars) {

        this.getMesh().rotation.y += 1 / 64 * globalVars.simSpeed;
        if (guiVars.removeSun) {
            globalVars.scene.remove(this.getMesh());
        } else {
            globalVars.scene.add(this.getMesh());
        }
    };

};