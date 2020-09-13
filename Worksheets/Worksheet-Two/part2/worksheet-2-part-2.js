function init() {

    var canvas = document.querySelector("#my-canvas");
    var gl = canvas.getContext("webgl");
    if (gl === null) {
        alert("Unable to initialize WebGL. Your browser or machine may not support it.");
        return;
    }

    var colorsEnum = {
        Cornflower: 0,
        Red: 1,
        Yellow: 2,
        Green: 3,
        Blue: 4,
        Magenta: 5,
        Cyan: 6,
        Black: 7,
    };
    var backGroundColor = colorsEnum.Cornflower;
    gl.clearColor(0.3921, 0.5843, 0.9294, 1.0);
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

    var clearMenu = document.getElementById("clearColor");
    var clearButton = document.getElementById("clearButton");
    clearButton.addEventListener("click", function(){
        backGroundColor = clearMenu.selectedIndex;
        index = 0;
        numPoints = 0;
        switch(backGroundColor) {
            case colorsEnum.Cornflower:
                gl.clearColor(0.3921, 0.5843, 0.9294, 1.0);
                break;
            case colorsEnum.Red:
                gl.clearColor(1, 0, 0, 1);
                break;
            case colorsEnum.Yellow:
                gl.clearColor(0, 1, 1, 1);
                break;
            case colorsEnum.Green:
                gl.clearColor(0, 1, 0, 1);
                break;
            case colorsEnum.Blue:
                gl.clearColor(0, 0, 1, 1);
                break;
            case colorsEnum.Magenta:
                gl.clearColor(1, 1, 0, 1);
                break;
            case colorsEnum.Cyan:
                gl.clearColor(0, 1, 1, 1);
                break;
            case colorsEnum.Black:
                gl.clearColor(0, 0, 0, 1);
                break;
        }
    });

        gl.bufferData(gl.ARRAY_BUFFER, maxVertices * sizeof['vec2'], gl.STATIC_DRAW);

        render();


    function render()
    {
        gl.viewport(0, 0, canvas.width, canvas.height);
        // gl.clearColor(0.3921, 0.5843, 0.9294, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        if(numPoints > 0) {
            gl.drawArrays(gl.POINTS, 0, numPoints);
        }
        window.requestAnimFrame(render, canvas);
    }
}
window.onload = init;
