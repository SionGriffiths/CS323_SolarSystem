

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


function getXRotationMatrixAsMat4 (angle){
    var radians = deg2rad(angle);
    var mat4 = new THREE.Matrix4();
    mat4.set(
        0, 1, 0, 0,
        0, Math.cos(radians), -Math.sin(radians),  0,
        0, Math.sin(radians), Math.cos(radians),  0,
        0, 0, 0, 1
    );
    return mat4;
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

function physicalToHomoCoords(vertPoints){
    vertPoints[3] = [];
    for (var i = 0; i < vertPoints[0].length; i++){
        vertPoints[3][i]=1;
    }
    return vertPoints;
}

function multiplyMatrices(matA, matB){
    var result = initMatrix(matA,matB);
    for(var row=0; row < matB.length; row++){
        for(var col=0; col < matB[0].length; col++){
            for(var i=0; i < matA[0].length; i++){
                result[row][col] += (matA[row][i] * matB[i][col]);
            }
        }
    }
    return result;
}

function initMatrix(matA,matB){
    var newMat = [];
    for(var i = 0; i < matA.length; i++){
        newMat[i] = [];
        for(var j = 0; j < matB[0].length; j++){
            newMat[i][j] = 0;
        }
    }
    return newMat;
}



