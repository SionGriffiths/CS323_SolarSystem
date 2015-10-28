var OrbitUtils = function(){

    this.testEllipse = function(e, periodSlices, semiMjorAxis){
        var orbitPoints = [];
        //var distanceFromPivot = 0;
        var theta = 0;
        var r = 0;
        //var e = 0.12;
        //var periodSlices = 365;
        //var semiMjorAxis = 14.960; //length of the axis???

        //for(var i = 0; i < periodSlices; i++){
        //    var x = polarXtoCart(r,theta);
        //    var y = polarYtoCart(r,theta);
        //    orbitPoints.push(new THREE.Vector3(x,y, 0));
        //    theta += computeTheta(e,theta,periodSlices);
        //    r =  computeR(e,theta,semiMjorAxis);
        //}

        while(theta <= periodSlices) {
            theta += computeTheta(e,theta,periodSlices);
            r =  computeR(e,theta,semiMjorAxis);
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
