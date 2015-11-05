var Earth = function(){

    this.geometry = null;
    this.material = null;
    this.mesh = null;
    this.orbitPoints = null;
    this.orbitPlot = null;
    var count = 0;

    this.init = function(){
        this.geometry = new THREE.SphereGeometry(4, 128, 128);
        this.material = new THREE.MeshPhongMaterial();
        this.material.map = THREE.ImageUtils.loadTexture('assets/images/earthmap1k.jpg');
        //this.material.bumpMap = THREE.ImageUtils.loadTexture('assets/images/earthbump1k.jpg');
        //this.material.bumpScale = 0.1;
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.mesh.rotateX(0.409105177);
        this.mesh.castShadow = true;
        this.mesh.receiveShadow = true;

    };

    this.getMesh = function(){
        return this.mesh;
    };

    this.update = function(globalVars,guiVars){
        var speed = globalVars.simSpeed;
        this.mesh.rotation.y  += (globalVars.earthRotationSpeed*speed)*0.1;
        this.mesh.position.z = this.orbitPoints[count].z;
        this.mesh.position.x = this.orbitPoints[count].x;

        count +=Math.floor(1 * speed) ;
        if(count >= this.orbitPoints.length){
            count = 0;
            globalVars.numEarthOrbits++;
        }
        if(guiVars.earthOrbitTrace){
            globalVars.scene.add(this.orbitPlot);
        }else{
            globalVars.scene.remove(this.orbitPlot);
        }
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