

function deg2rad (angle){
    return angle * (Math.PI / 180);
}

 function getXRotationMatrix (angle){
    var radians = deg2rad(angle);
    return [
        [1, 0, 0, 0],
        [0, Math.cos(radians), -Math.sin(radians), 0],
        [0,Math.sin(radians), Math.cos(radians), 0],
        [0, 0, 0, 1]
    ]
}

 function getZRotationMatrix (angle){
    var radians = deg2rad(angle);
    return [
        [Math.cos(radians), -Math.sin(radians), 0, 0],
        [Math.sin(radians), Math.cos(radians), 0, 0],
        [0, 0, 1, 0],
        [0, 0, 0, 1]
    ]
}

function getZRotationMatrixAsMat4 (angle){
    var radians = deg2rad(angle);
    var mat4 = new THREE.Matrix4();
    mat4.set(
        Math.cos(radians), -Math.sin(radians), 0, 0,
        Math.sin(radians), Math.cos(radians), 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1
    );
    return mat4;
}

function getYRotationMatrix (angle){
    var radians = deg2rad(angle);
    return [
        [Math.cos(radians), 0, Math.sin(radians), 0],
        [0, 1, 0, 0],
        [-Math.sin(radians), 0, Math.cos(radians), 0],
        [0, 0, 0, 1]
    ]
}

function getYRotationMatrixAsMat4 (angle){
    var radians = deg2rad(angle);
    var mat4 = new THREE.Matrix4();
    mat4.set(
        Math.cos(radians), 0, Math.sin(radians), 0,
        0, 1, 0, 0,
        -Math.sin(radians), 0, Math.cos(radians), 0,
        0, 0, 0, 1
    );
    return mat4;
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
    this.initialiseResultMatrix(resultMatrix, m);
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

 function initialiseResultMatrix (resultMatrix, m){
    for (var i = 0; i < m; i++){
        resultMatrix[i] = [];
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


