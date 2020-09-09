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

  function tick() {
    theta += 0.1;
    gl.uniform1f(thetaLocation, theta);
    render(gl, numPoints);
    requestAnimationFrame(tick);
  }

  var triangles = 
          [vec2(-0.5, 0.5), vec2(.5, .5), vec2(0.5,-0.5), vec2(-0.5, -0.5), vec2(-0.5, 0.5), vec2(0.5, -0.5)];

  numPoints = triangles.length;

  var vBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(triangles), gl.STATIC_DRAW);

  var vPosition = gl.getAttribLocation(program, "vPosition");
  gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(vPosition);

  var white = vec3(1.0, 1.0, 1.0);
  var colors= [];
  for (let i = 0; i < numPoints; i++){
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
   gl.drawArrays(gl.TRIANGLES, 0 , numPoints);}
   tick();
}
window.onload = init;
