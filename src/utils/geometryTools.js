var GeometryTools = function(){

   this.vec3 =  function(x,y,z){
        return new THREE.Vector3(x,y,z);
    };

    this.makeLine = function(point1, point2, colour){
        var lineGeometry = new THREE.Geometry(),
            lineMat = new THREE.LineBasicMaterial({color: colour});
        lineGeometry.vertices.push(point1, point2);
        return new THREE.Line(lineGeometry, lineMat);
    };

};
