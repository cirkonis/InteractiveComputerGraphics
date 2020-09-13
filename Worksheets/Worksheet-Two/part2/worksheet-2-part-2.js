function init() {

    var canvas = document.querySelector("#my-canvas");
    var gl = canvas.getContext("webgl");
    if (gl === null) {
        alert("Unable to initialize WebGL. Your browser or machine may not support it.");
        return;
    }
    program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);

    var vBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);

    var maxVertices = 1000;
    var index = 0;
    var numPoints = 0;
    var vPosition = gl.getAttribLocation(program, "vPosition");

    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    canvas.addEventListener("click", function (event) {
        var mousePosition = vec2((2 * event.clientX / canvas.width) - 1, (2 * (canvas.height - event.clientY) / canvas.height) - 1);
        gl.bufferSubData(gl.ARRAY_BUFFER, sizeof['vec2'] * index, flatten(mousePosition));
        numPoints = Math.max(numPoints, ++index);
        index %= maxVertices;
    });

    clearButton = document.getElementById("clearButton");
    clearButton.addEventListener("click", function(){
        index = 0;
        numPoints = 0;
        render();
    });

        gl.bufferData(gl.ARRAY_BUFFER, maxVertices * sizeof['vec2'], gl.STATIC_DRAW);

        render();


    function render()
    {
        gl.viewport(0, 0, canvas.width, canvas.height);
        gl.clearColor(0.3921, 0.5843, 0.9294, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        if(numPoints > 0) {
            gl.drawArrays(gl.POINTS, 0, numPoints);
        }
        window.requestAnimFrame(render, canvas);
    }
}
window.onload = init;
