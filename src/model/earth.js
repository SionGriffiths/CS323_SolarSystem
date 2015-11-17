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


    this.init = function(globalVars,guiVars){
        this.geometry = new THREE.SphereGeometry(4, 32, 32);
        this.material = new THREE.MeshPhongMaterial();
        this.material.map = THREE.ImageUtils.loadTexture('assets/images/earthmap1k.jpg');
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.mesh.castShadow = true;
        this.mesh.receiveShadow = true;
        this.globalVars = globalVars;
        this.guiVars = guiVars;
        this.matrixAutoUpdate = false;
        this.pointsInDay = (this.orbitPoints.length/365.26);
        rotValue = 360/this.pointsInDay*Math.floor(globalVars.simSpeed);
        this.rotationMatrix = getYRotationMatrixAsMat4(rotValue);
        this.axialTiltMatrix = getZRotationMatrixAsMat4(23.4);
        this.removeAxialTiltMatrix = getZRotationMatrixAsMat4(-23.4);
        this.mesh.applyMatrix(this.axialTiltMatrix);
    };

    this.getMesh = function(){
        return this.mesh;
    };


    var currads = 0;

    this.calcDays = function(radsAmount){
        currads += radsAmount;
        if(currads >= 2 * Math.PI){
            var tmp = currads - 2 * Math.PI;
            currads = 0;
            currads += tmp;
            this.numDays++;
            $("#earthDays").text("Earth Rotations : " + this.numDays);
        }
    };

    this.update = function(){
        rotValue = 360/this.pointsInDay*Math.floor(this.globalVars.simSpeed);
        this.rotationMatrix = getYRotationMatrixAsMat4(rotValue);
        this.calcDays(deg2rad(rotValue));

        var transToOrigin = new THREE.Matrix4().makeTranslation( -this.getX(), -this.getY(), -this.getZ());
        //translate mesh to origin before applying transforms
        this.mesh.applyMatrix(transToOrigin);
        this.mesh.applyMatrix(this.removeAxialTiltMatrix);
        this.mesh.applyMatrix(this.rotationMatrix);
        this.mesh.applyMatrix(this.axialTiltMatrix);


        //update position in pre-calculated orbit array
        this.mesh.position.z = this.orbitPoints[count].z;
        this.mesh.position.x = this.orbitPoints[count].x;

        count +=Math.floor(this.globalVars.simSpeed) ;
        //count++;
        if(count >= this.orbitPoints.length){
            count = 0;
            this.globalVars.numEarthOrbits++;
            $("#earthYears").text("Earth Orbits : " + this.globalVars.numEarthOrbits);
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



};