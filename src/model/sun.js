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
        var speed = globalVars.simSpeed;
        //this.getMesh().applyMatrix(getYRot(radianStep(27*globalVars.earthDay*speed)));
        if (guiVars.removeSun) {
            globalVars.scene.remove(this.getMesh());
        } else {
            globalVars.scene.add(this.getMesh());
        }
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
    var radianStep = function (degrees) {
        return (2 * Math.PI) / degrees;
    };
};