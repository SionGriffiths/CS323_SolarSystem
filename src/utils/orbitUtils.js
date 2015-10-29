var OrbitUtils = function(){

    this.generateElliptical = function(e, periodSlices, semiMajorAxis){
        var orbitPoints = [];
        var theta = 0;
        var r = 0;

        while(theta <= 2*Math.PI) {
            theta += computeTheta(e,theta,periodSlices);
            r =  computeR(e,theta,semiMajorAxis);
            //console.log("r = ", r, "theta = ", theta);
            var x = polarXtoCart(r,theta);
            var z = polarZtoCart(r,theta);
            orbitPoints.push(new THREE.Vector3(x,0,z));
        }
        return orbitPoints;
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

};
