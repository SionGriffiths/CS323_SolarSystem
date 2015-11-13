var OrbitUtils = function(matUtils){

    var matrixUtils = matUtils;

    this.generateElliptical = function(e, periodSlices, semiMajorAxis, tiltValue){

        var orbitVerts = [[],[],[]];
        var theta = 0;
        var r = 0;

        while(theta <= 2*Math.PI) {
            theta += computeTheta(e,theta,periodSlices);
            r =  computeR(e,theta,semiMajorAxis);
            var x = polarXtoCart(r,theta);
            var z = polarZtoCart(r,theta);

            //z first so direction of orbit is anti-clockwise if viewed from above.
            orbitVerts[0].push(z);
            orbitVerts[1].push(0);
            orbitVerts[2].push(x);
        }

        if(tiltValue != 0) {
            return applyTiltToOrbit(tiltValue, orbitVerts);
        }else {
            return matrixUtils.convertMatrixToVertices(orbitVerts);
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
        var operationMatrix =  matrixUtils.getXRotationMatrix(angle);
        var coordinateMatrix =  matrixUtils.convertToHomogenousCoordinates(points);
        var appliedMatrix =  matrixUtils.multiplyMatrices(operationMatrix, coordinateMatrix);
        return  matrixUtils.convertMatrixToVertices(appliedMatrix);
    };

    this.plotOrbit = function(orbitPoints,colour){
        var material = new THREE.LineBasicMaterial({
            color: colour
        });
        var geometry = new THREE.Geometry();
        for(var i = 0; i < orbitPoints.length; i++ ){
            geometry.vertices.push(orbitPoints[i]);
        }
        return new THREE.Line(geometry, material);
    };



};
