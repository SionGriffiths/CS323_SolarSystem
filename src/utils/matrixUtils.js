

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

function multiplyMatricesAsArray(matA, matB){
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


//Using three.js structures mandates more manual approach.
function columnMajorMat4Multiplication(matA, matB){
    var e1 = matA.elements;
    var e2 = matB.elements;
    var result = new THREE.Matrix4();

    result.set(
        (e2[0] * e1[0]) + (e2[4] * e1[1]) + (e2[8] * e1[2]) + (e2[12] * e1[3]),
        (e2[0] * e1[4]) + (e2[4] * e1[5]) + (e2[8] * e1[6]) + (e2[12] * e1[7]),
        (e2[0] * e1[8]) + (e2[4] * e1[9]) + (e2[8] * e1[10]) + (e2[12] * e1[11]),
        (e2[0] * e1[12]) + (e2[4] * e1[13]) + (e2[8] * e1[14]) + (e2[12] * e1[15]),

        // second column
        (e2[1] * e1[0]) + (e2[5] * e1[1]) + (e2[9] * e1[2]) + (e2[13] * e1[3]),
        (e2[1] * e1[4]) + (e2[5] * e1[5]) + (e2[9] * e1[6]) + (e2[13] * e1[7]),
        (e2[1] * e1[8]) + (e2[5] * e1[9]) + (e2[9] * e1[10]) + (e2[13] * e1[11]),
        (e2[1] * e1[12]) + (e2[5] * e1[13]) + (e2[9] * e1[14]) + (e2[13] * e1[15]),

        // third column
        (e2[2] * e1[0]) + (e2[6] * e1[1]) + (e2[10] * e1[2]) + (e2[14] * e1[3]),
        (e2[2] * e1[4]) + (e2[6] * e1[5]) + (e2[10] * e1[6]) + (e2[14] * e1[7]),
        (e2[2] * e1[8]) + (e2[6] * e1[9]) + (e2[10] * e1[10]) + (e2[14] * e1[11]),
        (e2[2] * e1[12]) + (e2[6] * e1[13]) + (e2[10] * e1[14]) + (e2[14] * e1[15]),

        // fourth column
        (e2[3] * e1[0]) + (e2[7] * e1[1]) + (e2[11] * e1[2]) + (e2[15] * e1[3]),
        (e2[3] * e1[4]) + (e2[7] * e1[5]) + (e2[11] * e1[6]) + (e2[15] * e1[7]),
        (e2[3] * e1[8]) + (e2[7] * e1[9]) + (e2[11] * e1[10]) + (e2[15] * e1[11]),
        (e2[3] * e1[12]) + (e2[7] * e1[13]) + (e2[11] * e1[14]) + (e2[15] * e1[15])
    );

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


function applyMat4toVec3(mat4, vect3){

    var e = mat4.elements;

    vect3.set(
        (e[0] * vect3.x) + (e[4] * vect3.y) + (e[8] * vect3.z) + (e[12]),
        (e[1] * vect3.x) + (e[5] * vect3.y) + (e[9] * vect3.z) + (e[13]),
        (e[2] * vect3.x) + (e[6] * vect3.y) + (e[10] * vect3.z) + (e[14]),
        (e[3] * vect3.x) + (e[7] * vect3.y) + (e[11] * vect3.z) + (e[15])
    );

    return vect3;

}

function translateToCoords(matrix,x,y,z){

    var elements

}




