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

    this.init = function(globalVars,guiVars){
        this.geometry = new THREE.SphereGeometry(4, 128, 128);
        this.material = new THREE.MeshPhongMaterial();
        this.material.map = THREE.ImageUtils.loadTexture('assets/images/earthmap1k.jpg');
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.mesh.castShadow = true;
        this.mesh.receiveShadow = true;
        this.mesh.matrix = new THREE.Matrix4();
        this.globalVars = globalVars;
        this.guiVars = guiVars;
        //this.matrixAutoUpdate = false;
        this.rotationMatrix = getYRot(radians(((this.globalVars.earthYear/365)/360)*(this.globalVars.simSpeed/10)));
        this.axialTiltMatrix = getRotZ(radians(23.4));
        this.removeAxialTiltMatrix = getRotZ(radians(-23.4));
        this.mesh.applyMatrix(this.axialTiltMatrix);
    };

    this.getMesh = function(){
        return this.mesh;
    };

    this.update = function(){

        var transToOrigin = new THREE.Matrix4().makeTranslation( -this.getX(), -this.getY(), -this.getZ());

        this.mesh.applyMatrix(transToOrigin);
        this.mesh.applyMatrix(this.removeAxialTiltMatrix);
        this.mesh.applyMatrix(this.rotationMatrix);
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