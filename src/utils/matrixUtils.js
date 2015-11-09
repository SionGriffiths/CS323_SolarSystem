var MatrixUtils = function(){

   this.getXRotationMatrix = function (angle){
        var radians = angle * (Math.PI / 180);
        return [
            [1, 0, 0, 0],
            [0, Math.cos(radians), -Math.sin(radians), 0],
            [0,Math.sin(radians), Math.cos(radians), 0],
            [0, 0, 0, 1]
        ]
    };

   this.getZRotationMatrix = function (angle){
        var radians = angle * (Math.PI / 180);
        return [
            [Math.cos(radians), -Math.sin(radians), 0, 0],
            [Math.sin(radians), Math.cos(radians), 0, 0],
            [0, 0, 1, 0],
            [0, 0, 0, 1]
        ]
    };

    this.getYRotationMatrix = function (angle){
        var radians = angle * (Math.PI / 180);
        return [
            [Math.cos(radians), 0, Math.sin(radians), 0],
            [0, 1, 0, 0],
            [-Math.sin(radians), 0, Math.cos(radians), 0],
            [0, 0, 0, 1]
        ]
    };

    this.convertToHomogenousCoordinates = function (dataPoints){
        var numVerticies = dataPoints[0].length;
        var homoRow = [];
        for (var i = 0; i < numVerticies; i++){
            homoRow.push(1);
        }
        dataPoints.push(homoRow);
        return dataPoints;
    };


    this.multiplyMatrices = function (first, second){
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
    };

    this.initialiseResultMatrix = function (resultMatrix, m){
        for (var i = 0; i < m; i++){
            resultMatrix[i] = [];
        }
        return resultMatrix;
    };

    this.convertMatrixToVertices = function(matrix){
        var vertices = [];
        for (var i = 0; i < matrix[0].length; i++){
            vertices.push(new THREE.Vector3(matrix[0][i], matrix[1][i], matrix[2][i]));
        }
        return vertices;
    }


};