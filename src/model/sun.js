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
        var annualRotations = (globalVars.numIterationsInYear/13.52);
        var speed = Math.floor(globalVars.simSpeed);
        var rotValue = 360/annualRotations*speed;
        this.calcDays(deg2rad(rotValue));
        return getYRotationMatrixAsMat4(rotValue);
    };

    this.setAxisLine = function(lines){
        var self = this;
        $.each( lines, function( key, value ) {
            self.mesh.add(value);
        });
    };

    this.removeAxisLine = function(lines){
        var self = this;
        $.each( lines, function( key, value ) {
            self.mesh.remove(value);
        });
    };


};

//calculate rotation per update
rotValue = 360/this.pointsInDay*Math.floor(this.globalVars.simSpeed);
this.rotationMatrix = getYRotationMatrixAsMat4(rotValue);

var transToOrigin = new THREE.Matrix4().makeTranslation( -this.getX(), -this.getY(), -this.getZ());
//translate mesh to origin before applying transforms
this.mesh.applyMatrix(transToOrigin);

this.mesh.applyMatrix(this.removeAxialTiltMatrix);
this.mesh.applyMatrix(this.rotationMatrix);
this.mesh.applyMatrix(this.axialTiltMatrix);

//update position in pre-calculated orbit array
this.mesh.position.z = this.orbitPoints[count].z;
this.mesh.position.x = this.orbitPoints[count].x;