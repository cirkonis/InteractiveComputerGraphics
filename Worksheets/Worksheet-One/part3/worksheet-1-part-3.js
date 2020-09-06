function init() {

  var canvas = document.querySelector("#my-canvas");
  var gl = canvas.getContext("webgl");
  if (gl === null) {
    alert("Unable to initialize WebGL. Your browser or machine may not support it.");
    return;
  }
   



  program = initShaders(gl, "vertex-shader", "fragment-shader");
  gl.useProgram(program);

  var triangles = 
          [vec2(0, 0), vec2(1, 0), vec2(1,1)];

  numPoints = triangles.length;

  var vBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(triangles), gl.STATIC_DRAW);

  var vPosition = gl.getAttribLocation(program, "vPosition");
  gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(vPosition);


  var colors=
          [vec3(1.0, 0.0, 0.0),  vec3(0.0, 1.0, 0.0), vec3(0.0, 0.0, 1.0)];

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
   gl.drawArrays(gl.TRIANGLES, 0 , numPoints);

}





}
window.onload = init;