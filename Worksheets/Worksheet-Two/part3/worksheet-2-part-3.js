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

    program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);

    var vBuffer = gl.createBuffer();
    var vPosition = gl.getAttribLocation(program, "vPosition");
    var cBuffer = gl.createBuffer();
    var vColor = gl.getAttribLocation(program, "vColor");
    var maxVertices = 1000;
    var index = 0;
    var selectedColor = document.getElementById("colorMenu");
    var centerMode = document.getElementById("centerMode");
    var offset = 0;
    var pointMode = document.getElementById("pointMode");
    var triangleMode = document.getElementById("triangleMode");
    var circleMode = document.getElementById("circleMode");
    var points = [];
    var pointIndex = 0;
    var triangles = [];
    var triangleIndex = 0;
    var cornerCounter = 1;
    var triangleCounter = 0;

    triangleMode.checked = true;

    pointMode.addEventListener("change", function(){
        if(pointMode.checked === true){
            triangleMode.checked = false;
            circleMode.checked = false;
        }
    });
    triangleMode.addEventListener("change", function(){
        if(triangleMode.checked === true){
            pointMode.checked = false;
            circleMode.checked = false;
        }
    });
    circleMode.addEventListener("change", function(){
        if(circleMode.checked === true){
            triangleMode.checked = false;
            pointMode.checked = false;
        }
    });

    canvas.addEventListener("click", function (event) {
        // some magic numbers but it does what it does and what it needs to do
        if(centerMode.checked === true){offset = .034;}else{offset = 0;};

        if(pointMode.checked === true) {
         points.push(index);
         console.log(points);
         bufferCycle(getMousePosition(offset, event), colors[selectedColor.selectedIndex]);

        }

        if(triangleMode.checked === true){
            if(cornerCounter %= 3 !== 0) {
                triangles.push(index);
                bufferCycle(getMousePosition(offset, event), colors[selectedColor.selectedIndex]);
                console.log("triangles: " + triangles);
                console.log("triangles length: " + triangles.length);

            }else{
                triangles.push(index);
                bufferCycle(getMousePosition(offset, event), colors[selectedColor.selectedIndex]);
                triangleCounter++;
                console.log("triangles: " + triangles);
                console.log("triangles length: " + triangles.length);
            }
            cornerCounter++;
            console.log(cornerCounter);
        }
    });


    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);
    gl.bufferData(gl.ARRAY_BUFFER, maxVertices * sizeof['vec2'], gl.STATIC_DRAW);

    gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
    gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vColor);
    gl.bufferData(gl.ARRAY_BUFFER, maxVertices * sizeof['vec4'], gl.STATIC_DRAW);

    var clearMenu = document.getElementById("clearColor");
    var clearButton = document.getElementById("clearButton");
    clearButton.addEventListener("click", function(){
        backGroundColor = colors[clearMenu.selectedIndex];
        index = 0;
        gl.clearColor(backGroundColor[0], backGroundColor[1], backGroundColor[2], backGroundColor[3]);
    });

    render();

    function render()
    {
        gl.viewport(0, 0, canvas.width, canvas.height);
        gl.clear(gl.COLOR_BUFFER_BIT);
            if (points.length > 0) {
                 gl.drawArrays(gl.POINTS, 0, points.length);
            }
            if (triangles.length > 0) {
               gl.drawArrays(gl.TRIANGLES, 0, triangles.length);
            }

        window.requestAnimFrame(render);
    }

    function getMousePosition(offset, event){
        return vec2((2 * event.clientX / canvas.width) - (.9999 + offset), (2 * (canvas.height - event.clientY) / canvas.height) - (.99 - offset));
    }

    function bufferCycle(vertexVector, colorVector){
        gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
        gl.bufferSubData(gl.ARRAY_BUFFER, sizeof['vec2'] * index, flatten(vertexVector));
        gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
        gl.bufferSubData(gl.ARRAY_BUFFER, sizeof['vec4'] * index, flatten(colorVector));
        index++;
    }
}
window.onload = init;
