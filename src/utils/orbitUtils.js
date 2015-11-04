var OrbitUtils = function(){

    this.generateElliptical = function(e, periodSlices, semiMajorAxis, tiltValue){
        var orbitPoints = [];
        var orbitVerts = [[],[],[]];
        var theta = 0;
        var r = 0;

        while(theta <= 2*Math.PI) {
            theta += computeTheta(e,theta,periodSlices);
            r =  computeR(e,theta,semiMajorAxis);
            var x = polarXtoCart(r,theta);
            var z = polarZtoCart(r,theta);
            orbitVerts[0].push(x);
            orbitVerts[1].push(0);
            orbitVerts[2].push(z);
            //orbitPoints.push(new THREE.Vector4(x,0,z,1));
        }
        var ret;
            if(tiltValue != 0) {
               ret = applyTiltToOrbit(tiltValue, orbitVerts);
            }else {
                ret = convertMatrixToVertices(orbitVerts);
            }


            console.log(ret);



            return ret;


        //return orbitPoints;
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
        var operationMatrix = getZRotationMatrix(angle);
        var coordinateMatrix = convertToHomogenousCoordinates(points);
        var appliedMatrix = multiplyMatrices(operationMatrix, coordinateMatrix);
        return convertMatrixToVertices(appliedMatrix);
    };

    function getXRotationMatrix(angle){
        var radians = angle * (Math.PI / 180);
        return [
            [1, 0, 1, 0],
            [0, Math.cos(radians), -Math.sin(radians), 0],
            [-Math.sin(radians), 0, Math.cos(radians), 0],
            [0, Math.sin(radians), Math.cos(radians), 1]
        ]
    }

    function getZRotationMatrix(angle){
        var radians = angle * (Math.PI / 180);
        return [
            [Math.cos(radians), -Math.sin(radians), 0, 0],
            [Math.sin(radians), Math.cos(radians), 0, 0],
            [0, 0, 1, 0],
            [0, 0, 0, 1]
        ]
    }

    function getYRotationMatrix(angle){
        var radians = angle * (Math.PI / 180);
        return [
            [Math.cos(radians), 0, Math.sin(radians), 0],
            [0, 1, 0, 0],
            [-Math.sin(radians), 0, Math.cos(radians), 0],
            [0, 0, 0, 1]
        ]
    }

    function convertToHomogenousCoordinates(dataPoints){
        var numVerticies = dataPoints[0].length;
        var homoRow = [];
        for (var i = 0; i < numVerticies; i++){
            homoRow.push(1);
        }
        dataPoints.push(homoRow);
        return dataPoints;
    }


    function multiplyMatrices(first, second){
        var sum = 0;
        var resultMatrix = [[]];
        var m = first.length;
        var q = second[0].length;
        var p = second.length;
        initialiseResultMatrix(resultMatrix, m, p);
        for (var c = 0; c < m; c++)
        {
            for (var d = 0; d < q; d++)
            {
                for (var k = 0; k < p; k++)
                {
                    sum = sum + first[c][k] * second[k][d];
                }
                resultMatrix[c][d] = sum;
                sum = 0;
            }
        }
        return resultMatrix;
    }

    function initialiseResultMatrix(resultMatrix, m, p){
        for (var i = 0; i < m; i++){
            resultMatrix[i] = [];
            for (var ii = 0; ii < p; ii++){
                resultMatrix[i][ii] = 0;
            }
        }
        return resultMatrix;
    }
    function convertMatrixToVertices(matrix){
        var vertices = [];
        for (var i = 0; i < matrix[0].length; i++){
            vertices.push(new THREE.Vector3(matrix[0][i], matrix[1][i], matrix[2][i]));
        }
        return vertices;
    }
};
