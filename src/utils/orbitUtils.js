var OrbitUtils = function(){

    this.testEllipse = function(e, periodSlices, semiMajorAxis){
        var orbitPoints = [];
        var theta = 0;
        var r = 0;

        while(theta <= periodSlices) {
            theta += computeTheta(e,theta,periodSlices);
            r =  computeR(e,theta,semiMajorAxis);
            //console.log("r = ", r, "theta = ", theta);
            var x = polarXtoCart(r,theta);
            var y = polarYtoCart(r,theta);
            orbitPoints.push(new THREE.Vector3(x, y,0));
        }
        return orbitPoints;
    };

    var computeTheta = function(e,theta,periodSlices){
        return ((2/periodSlices)* Math.pow((1+ (e*Math.cos(theta))),2))  / Math.pow( (1-Math.pow(e,2)) ,(3/2));
    };

    var computeR = function(e, theta, a){
        return (a*(1-Math.pow(e,2)))/(1+e*Math.cos(theta));
    };

    var polarXtoCart = function(r, theta){
        return r * Math.cos(theta);
    };

    var polarYtoCart = function(r, theta){
        return r * Math.sin(theta);
    };

};
