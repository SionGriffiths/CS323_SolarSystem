var GeometryTools = function() {

    var vec3 = function (x, y, z) {
        return new THREE.Vector3(x, y, z);
    };

    var makeLine = function (point1, point2, colour) {
        var lineGeometry = new THREE.Geometry(),
            lineMat = new THREE.LineBasicMaterial({color: colour});
        lineGeometry.vertices.push(point1, point2);
        return new THREE.Line(lineGeometry, lineMat);
    };

    this.makeLines = function (length, doubleside, col1, col2, col3) {
        var lines = [];
        var p2 = 0;
        if (doubleside) {
            p2 = length;
        }
        lines.push(makeLine(vec3(length, 0, 0), vec3(-p2, 0, 0), col1));
        lines.push(makeLine(vec3(0, length, 0), vec3(0, -p2, 0), col2));
        lines.push(makeLine(vec3(0, 0, length), vec3(0, 0, -p2), col3));
        return lines;
    };

};
