var Sun = function(){

    this.geometry = null;
    this.material = null;
    this.mesh = null;
    this.rotMatrix = null;
    this.globalVars = null;

    this.init = function(globalVars){
        this.geometry = new THREE.SphereGeometry(14, 32, 32);
        this.material = new THREE.MeshBasicMaterial();
        this.material.map = THREE.ImageUtils.loadTexture('assets/images/sunmap.jpg');
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.globalVars = globalVars;
    };

    this.getMesh = function(){
        return this.mesh;
    };

    this.update = function(guiVars) {

        this.getMesh().applyMatrix(computeRotationMatrix(this.globalVars));
        if (guiVars.removeSun) {
            this.globalVars.scene.remove(this.getMesh());
        } else {
            this.globalVars.scene.add(this.getMesh());
        }
    };


    var computeRotationMatrix = function(globalVars){
    //13.52
        var annualRotations = (globalVars.numIterationsInYear/13.52);
        var rotValue = 360/annualRotations*globalVars.simSpeed;
        return getYRot(radians(rotValue));
    };


    var getYRot = function (radians){
        //var radians = angle * (Math.PI / 180);
        var mat4 = new THREE.Matrix4();
        var s = Math.sin(radians);
        var c = Math.cos(radians);
        mat4.set(
            c, 0, s, 0,
            0, 1, 0, 0,
            -s, 0, c, 0,
            0, 0, 0, 1
        );
        return mat4;
    };
    var radians = function (degrees) {
        return degrees * (Math.PI / 180);
    };
};