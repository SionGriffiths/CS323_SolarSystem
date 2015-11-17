var OrbitUtils = function(){

    this.generateElliptical = function(eccentricity, periodSlices, semiMajorAxis, tiltValue){

        var orbitVerts = [];
        var theta = 0;
        var r = 0;

        while(theta <= 2*Math.PI) {
            theta += computeTheta(eccentricity,theta,periodSlices);
            r =  computeR(eccentricity,theta,semiMajorAxis);
            var x = polarXtoCart(r,theta);
            var z = polarZtoCart(r,theta);
            orbitVerts.push(vec3(z,0,x));
        }

        if(tiltValue != 0) {
            return applyTiltToOrbit(tiltValue,orbitVerts);
        }else {
            return orbitVerts;
        }
    };

    //((2/N)( 1+ e cos ? )^2)/(1-e^2)^(3/2)
    var computeTheta = function(e,theta,periodSlices){
        return ((2/periodSlices)* Math.pow((1+ (e*Math.cos(theta))),2))  / Math.pow( (1-Math.pow(e,2)) ,(3/2));
    };

    //r = a(1-e^2)/(1+ e cos ? )
    var computeR = function(e, theta, a){
        return (a*(1-Math.pow(e,2)))/(1+e*Math.cos(theta));
    };

    var polarXtoCart = function(r, theta){
        return r * Math.cos(theta);
    };

    var polarZtoCart = function(r, theta){
        return r * Math.sin(theta);
    };

    var applyTiltToOrbit = function(angle, points){
        var tiltRotation =  getZRotationMatrixAsMat4(angle);
        for(var i = 0; i < points.length; i++){
            points[i].applyMatrix4(tiltRotation);
        }
        return points;
    };

    this.plotOrbit = function(orbitPoints,colour){
        var material = new THREE.LineBasicMaterial({
            color: colour
        });
        var geometry = new THREE.Geometry();
        geometry.vertices = orbitPoints;
        return new THREE.Line(geometry, material);
    };



};
