var MatrixUtils = function(){

    this.matMulti = function(matA, matB){

        var result = [];
        for(var j = 0; j < matB.length; j++) {
            result[j] = [];
            for(var k = 0; k < matA[0].length; k++) {
                var sum = 0;
                for(var i = 0; i < matA.length; i++) {
                    sum += matA[i][k] * matB[j][i];
                }
                result[j].push(sum);
            }
        }
        return result;  

    };

    this.homogeniseMatrix = function(mat){

    };


};