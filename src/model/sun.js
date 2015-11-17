var Sun = function(){

    this.geometry = null;
    this.material = null;
    this.mesh = null;
    this.globalVars = null;
    this.numRots = 0;

    this.init = function(globalVars){
        this.geometry = new THREE.SphereGeometry(14, 64, 64);
        this.material =  new THREE.MeshPhongMaterial({
            emissive: 0xF2E9A6, //emission colour
            emissiveMap: new THREE.TextureLoader().load("assets/images/sunmap.jpg")
        });
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.globalVars = globalVars;
    };

    this.getMesh = function(){
        return this.mesh;
    };

    this.update = function(guiVars) {

        if (guiVars.removeSun) {
            this.globalVars.scene.remove(this.getMesh());
        } else {
            this.globalVars.scene.add(this.getMesh());
        }

        this.getMesh().applyMatrix(this.computeRotationMatrix(this.globalVars));

    };


    var currads = 0;
    this.calcDays = function(radsAmount){
        currads += radsAmount;
        if(currads >= 2 * Math.PI){
            var tmp = currads - 2 * Math.PI;
            currads = 0;
            currads += tmp;
            this.numRots++;
            $("#sunRotations").text("Sun Rotations : " + this.numRots);
        }
    };
    
    this.computeRotationMatrix = function(globalVars){
    //13.52
        var annualRotations = (globalVars.numIterationsInYear/13.52);
        var speed = Math.floor(globalVars.simSpeed);
        var rotValue = 360/annualRotations*speed;
        this.calcDays(deg2rad(rotValue));
        return getYRotationMatrixAsMat4(rotValue);
    };



};

