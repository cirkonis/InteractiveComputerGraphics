function init() {

    var canvas = document.querySelector("#my-canvas");
    var gl = canvas.getContext("webgl");
    if (gl === null) {
        alert("Unable to initialize WebGL. Your browser or machine may not support it.");
        return;
    }

    program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);

    var thetaLocation = gl.getUniformLocation(program, "theta");
    var theta = 0.0;
    var translateLocation = gl.getUniformLocation(program, "translateY");
    var translateY =  0.0;
    var translationSpeed = .04;
    var numSegments = 30;
    var radius = .2;
    var direction = 1;
    // initially I tried using uniform2fv and having a vec2 translate in the vertex shader so I could use the
    // indepentant .x and .y values but it wouldn't work for, no shapre would appear at any rate.
    // I could add the other components individually
    // then add them combine them here to make a translation vector but it seems like a work around???
    // settled for just using the one value for now since thats all the behaviour the work sheet called for.

    function uppyDowny(){
        if (translateY > 1 - radius) {
            direction = -1;
        }
        if (translateY < -1 + radius) {
            direction = 1;
        }
    }


    function tick() {
        theta += 0.0;
        gl.uniform1f(thetaLocation, theta);
        uppyDowny();
        translateY += (translationSpeed * direction);
        console.log(translateY);
        console.log(direction);
        gl.uniform1f(translateLocation, translateY);
        render(gl, numPoints);
        requestAnimationFrame(tick);
    }
    var circleCenter = vec2(0.0, 0.0);
    var triangles = [circleCenter];
    //circle making time
    for (let i = 0; i < numSegments + 2; i++){
        theta = (2 * Math.PI * i)/numSegments;
        var nextVertex = vec2(radius * Math.cos(theta), radius * Math.sin(theta));
        triangles.push(nextVertex);
    }
    numPoints = triangles.length;

    var vBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(triangles), gl.STATIC_DRAW);

    var vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    var white = vec3(1.0, 1.0, 1.0);
    var colors= [];
    for(let i = 0; i < numPoints; i++){
        colors.push(white);
    }


    var cBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW);


    var vColor = gl.getAttribLocation(program, "vColor");
    gl.vertexAttribPointer(vColor, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vColor);



    render();


    function render()
    {
        gl.viewport(0, 0, canvas.width, canvas.height);
        gl.clearColor(0.3921, 0.5843, 0.9294, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.drawArrays(gl.TRIANGLE_FAN, 0 , numPoints);}
    tick();
}
window.onload = init;
