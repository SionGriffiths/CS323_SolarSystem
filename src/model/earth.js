var Earth = function(){

    this.geometry = null;
    this.material = null;
    this.mesh = null;
    this.orbitPoints = null;
    this.orbitPlot = null;
    var count = 0;
    this.globalVars = null;
    this.guiVars = null;
    this.rotationMatrix = null;
    this.axialTiltMatrix = null;
    this.removeAxialTiltMatrix = null;
    this.numDays = 0;
    this.pointsInDay = 0;
    var rotValue = 0;
var temp = 0;

    this.init = function(globalVars,guiVars){
        this.geometry = new THREE.SphereGeometry(4, 128, 128);
        this.material = new THREE.MeshPhongMaterial();
        this.material.map = THREE.ImageUtils.loadTexture('assets/images/earthmap1k.jpg');
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.mesh.castShadow = true;
        this.mesh.receiveShadow = true;
        this.globalVars = globalVars;
        this.guiVars = guiVars;
        this.matrixAutoUpdate = false;
        console.log((this.orbitPoints.length/365.26));
        this.pointsInDay = (this.orbitPoints.length/365.26);
        console.log(this.pointsInDay);
        rotValue = 360/this.pointsInDay*globalVars.simSpeed;
        this.rotationMatrix = getYRot(radians(rotValue));
        temp = radians(rotValue);
        this.axialTiltMatrix = getRotZ(radians(23.4));
        this.removeAxialTiltMatrix = getRotZ(radians(-23.4));
        this.mesh.applyMatrix(this.axialTiltMatrix);
    };

    this.getMesh = function(){
        return this.mesh;
    };
    var counter = 0;
    var days = 0;
    var years = 0;
    var currads = 0;

    this.calcDays = function(radsAmount){
        currads += radsAmount;
        if(currads >= 2 * Math.PI){
            var tmp = currads - 2 * Math.PI;
            currads = 0;
            currads += tmp;
            this.numDays++;
        }
    };

    this.update = function(){
        rotValue = 360/this.pointsInDay*this.globalVars.simSpeed;
        this.rotationMatrix = getYRot(radians(rotValue));
        if(counter%10 == 0){
            console.log(days++  +  " " + this.globalVars.numEarthOrbits  + "            count is  - " + count);
            console.log(this.numDays);
        }
        var transToOrigin = new THREE.Matrix4().makeTranslation( -this.getX(), -this.getY(), -this.getZ());

        this.mesh.applyMatrix(transToOrigin);
        this.mesh.applyMatrix(this.removeAxialTiltMatrix);
        this.mesh.applyMatrix(this.rotationMatrix);
        this.calcDays(radians(rotValue));
        this.mesh.applyMatrix(this.axialTiltMatrix);


        //update position in pre-calculated orbit array
        this.mesh.position.z = this.orbitPoints[count].z;
        this.mesh.position.x = this.orbitPoints[count].x;

        count +=Math.floor(1 * this.globalVars.simSpeed) ;
        //count++;
        if(count >= this.orbitPoints.length){
            count = 0;

            this.globalVars.numEarthOrbits++;
        }
        counter++;
    };

    this.updateOrbitPlots = function(){
        if(this.guiVars.earthOrbitTrace){
            this.globalVars.scene.add(this.orbitPlot);
        }else{
            this.globalVars.scene.remove(this.orbitPlot);
        }
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

    this.getX = function(){
        return this.getMesh().position.x;
    };
    this.getY = function(){
        return this.getMesh().position.y;
    };
    this.getZ = function(){
        return this.getMesh().position.z;
    };

    var getYRot = function (radians){
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


    var getRotZ = function (radians) {
        var mat4 = new THREE.Matrix4();
        var s = Math.sin(radians);
        var c = Math.cos(radians);
        mat4.set(
            c, -s, 0, 0,
            s, c, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1
        );

        return mat4;
    };

    var radianStep = function (degrees) {
        return (2 * Math.PI) / degrees;
    };

    var radians = function (degrees) {
        return degrees * (Math.PI / 180);
    };
};