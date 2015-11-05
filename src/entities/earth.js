var Earth = function(){

    this.geometry = null;
    this.material = null;
    this.mesh = null;
    this.orbitPoints = null;
    this.orbitPlot = null;
    var count = 0;
    this.globalVars = null;
    this.guiVars = null;

    this.init = function(globalVars,guiVars){
        this.geometry = new THREE.SphereGeometry(4, 128, 128);
        this.material = new THREE.MeshPhongMaterial();
        this.material.map = THREE.ImageUtils.loadTexture('assets/images/earthmap1k.jpg');
        //this.material.bumpMap = THREE.ImageUtils.loadTexture('assets/images/earthbump1k.jpg');
        //this.material.bumpScale = 0.1;
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.mesh.rotateX(0.409105177);
        this.mesh.castShadow = true;
        this.mesh.receiveShadow = true;
        this.globalVars = globalVars;
        this.guiVars = guiVars;
    };

    this.getMesh = function(){
        return this.mesh;
    };

    this.update = function(){
      var speed =  this.globalVars.simSpeed;
        this.mesh.rotation.y  += (this.globalVars.earthRotationSpeed*speed)*0.1;
        this.mesh.position.z = this.orbitPoints[count].z;
        this.mesh.position.x = this.orbitPoints[count].x;

        count +=Math.floor(1 * speed) ;
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

    this.setAxisLine = function(line){
        this.mesh.add(line);
    };

    this.removeAxisLine = function(line){
        this.mesh.remove(line);
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