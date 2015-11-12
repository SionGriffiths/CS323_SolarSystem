var Moon = function(){

    this.geometry = null;
    this.material = null;
    this.mesh = null;
    this.orbitPoints = null;
    this.orbitPlot = null;
    var count =0;
    
    this.init = function(){
        this.geometry = new THREE.SphereGeometry(1, 32, 32);
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

    
    this.update  = function(globalVars,earth){
        this.getMesh().lookAt(earth.getMesh().position);
        this.getMesh().position.x = earth.getX() + this.orbitPoints[count].x;
        this.getMesh().position.z = earth.getZ() + this.orbitPoints[count].z;
        this.getMesh().position.y = earth.getY() + this.orbitPoints[count].y;
        count += Math.floor(1 * globalVars.simSpeed);
        if(count >= this.orbitPoints.length) {
            count = 0; globalVars.numMoonOrbits++;
        }

    };

    this.updateOrbitPlots = function(guiVars,globalVars,earth){
        if(guiVars.moonOrbitTrace){
            globalVars.scene.add(this.orbitPlot);
            this.orbitPlot.position.x = earth.getMesh().position.x;
            this.orbitPlot.position.z = earth.getMesh().position.z;
        }else{
            globalVars.scene.remove(this.orbitPlot);
        }
    };
    this.setAxisLine = function(line){
        this.mesh.add(line);
    };

    this.removeAxisLine = function(line){
        this.mesh.remove(line);
    };


};