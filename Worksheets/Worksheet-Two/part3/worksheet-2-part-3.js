function init() {

    var canvas = document.querySelector("#my-canvas");
    var gl = canvas.getContext("webgl");
    if (gl === null) {
        alert("Unable to initialize WebGL. Your browser or machine may not support it.");
        return;
    }

    var colors = [
        vec4(.3921, .5843,.9294, 1), // cornflower
        vec4(1, 0, 0, 1), // red
        vec4(1, 1, 0, 1), // yellow
        vec4(0, 1, 0, 1), // green
        vec4(0, 0, 1, 1), // blue
        vec4(1, 0, 1, 1), // magenta
        vec4(0, 1, 1, 1), // cyan
        vec4(0, 0, 0, 1), // black
        vec4(1, 1, 1, 1), //white
    ];
    var initialBgColor = colors[0];
    gl.clearColor(initialBgColor[0], initialBgColor[1], initialBgColor[2], initialBgColor[3]);
    colsArray = [];

    program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);

    var vBuffer = gl.createBuffer();
    var vPosition = gl.getAttribLocation(program, "vPosition");
    var cBuffer = gl.createBuffer();
    var vColor = gl.getAttribLocation(program, "vColor");

    var maxVertices = 1000;
    var index = 0;
    var numPoints = 0;
    var selectedColor = document.getElementById("colorMenu");
    var centerMode = document.getElementById("centerMode");
    console.log(centerMode);
    var offset = 0;

    canvas.addEventListener("click", function (event) {
        // some magic numbers but it does what it does
        if(centerMode.checked === true){offset = .036;}else{offset = 0;};
        var mousePosition = vec2((2 * event.clientX / canvas.width) - (.9999 + offset), (2 * (canvas.height - event.clientY) / canvas.height) - (.99 - offset));
        var currentColor = colors[selectedColor.selectedIndex];
        gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
        gl.bufferSubData(gl.ARRAY_BUFFER, sizeof['vec2'] * index, flatten(mousePosition));

        gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
        gl.bufferSubData(gl.ARRAY_BUFFER, sizeof['vec4'] * index, flatten(currentColor));
        numPoints = Math.max(numPoints, ++index);
        index %= maxVertices;

    });
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);
    gl.bufferData(gl.ARRAY_BUFFER, maxVertices * sizeof['vec2'], gl.STATIC_DRAW);

    gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer)
    gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vColor);
    gl.bufferData(gl.ARRAY_BUFFER, maxVertices * sizeof['vec4'], gl.STATIC_DRAW);

    var clearMenu = document.getElementById("clearColor");
    var clearButton = document.getElementById("clearButton");
    clearButton.addEventListener("click", function(){
        backGroundColor = colors[clearMenu.selectedIndex];
        index = 0;
        numPoints = 0;
        colsArray = [];
        gl.clearColor(backGroundColor[0], backGroundColor[1], backGroundColor[2], backGroundColor[3]);
    });

    render();

    function render()
    {
        gl.viewport(0, 0, canvas.width, canvas.height);
        gl.clear(gl.COLOR_BUFFER_BIT);
        if(numPoints > 0) {
            gl.drawArrays(gl.POINTS, 0, numPoints);
        }
        window.requestAnimFrame(render);
    }

}
window.onload = init;
