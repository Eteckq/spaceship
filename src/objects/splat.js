var splatShader;

function initSplatShader() {
  splatShader = initShaders("splat-vs", "splat-fs");

  // active ce shader
  gl.useProgram(splatShader);

  // adresse des variables uniform dans le shader
  splatShader.positionUniform = gl.getUniformLocation(splatShader, "uPosition");
  splatShader.texUniform = gl.getUniformLocation(splatShader, "uTex");
  splatShader.couleurUniform = gl.getUniformLocation(splatShader, "maCouleur");

  // console.log("splat shader initialized");
}

function Splat(angle = 0, direction = 1, color = "Blue") {
  // la texture est donnée en paramètre et stockée ici
  // elle est déjà chargée sur le GPU (carte graphique)
  if( color == "Blue") {
    this.splatTexture = initTexture(
      `textures/PNG/Lasers/laser${color}06.png`
    );
  } else {
    this.splatTexture = initTexture(
      `textures/PNG/Lasers/laser${color}03.png`
    );
  }
  
  this.initParameters();
  this.angle = angle;
  this.direction = direction;

  this.scale = 0.2;

  var wo2 = this.scale * this.width;
  var ho2 = this.scale * this.height;

  // un tableau contenant les positions des sommets (sur CPU donc)
  var vertices = [
    -wo2,
    -ho2,
    -0.8,
    wo2,
    -ho2,
    -0.8,
    wo2,
    ho2,
    -0.8,
    -wo2,
    ho2,
    -0.8,
  ];

  /*   if(this.angle !== 0){
    // console.log('non rotaté', vertices);
    mat4
    // console.log('rotaté', mat4.rotateX(vertices, this.angle));
  } */

  var coords = [0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0];

  var tri = [0, 1, 2, 0, 2, 3];

  this.vao = gl.createVertexArray();
  gl.bindVertexArray(this.vao);

  // cree un nouveau buffer sur le GPU et l'active
  this.vertexBuffer = gl.createBuffer();
  this.vertexBuffer.itemSize = 3;
  this.vertexBuffer.numItems = 4;
  gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
  gl.enableVertexAttribArray(0);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
  gl.vertexAttribPointer(0, this.vertexBuffer.itemSize, gl.FLOAT, false, 0, 0);

  // meme principe pour les coords
  this.coordBuffer = gl.createBuffer();
  this.coordBuffer.itemSize = 2;
  this.coordBuffer.numItems = 4;
  gl.bindBuffer(gl.ARRAY_BUFFER, this.coordBuffer);
  gl.enableVertexAttribArray(1);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(coords), gl.STATIC_DRAW);
  gl.vertexAttribPointer(1, this.coordBuffer.itemSize, gl.FLOAT, false, 0, 0);

  // creation des faces du cube (les triangles) avec les indices vers les sommets
  this.triangles = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.triangles);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(tri), gl.STATIC_DRAW);
  this.triangles.numItems = 6;

  gl.bindVertexArray(null);

  this.loaded = true;

  // console.log("splat initialized");
}

Splat.prototype.shader = function () {
  return splatShader;
};

Splat.prototype.initParameters = function () {
  // paramètres par défaut d'un splat (taille, position, couleur)
  this.width = 0.1;
  this.height = 0.3;
  this.position = [0.0, 0.0, 0.0];
  this.couleur = [1, 0, 0];
  this.time = 0.0;
};

Splat.prototype.setPosition = function (x, y, z) {
  this.position = [x, y, z];
};

Splat.prototype.setParameters = function (elapsed) {
  this.time += 0.01 * elapsed;
  let speed = 0.5;
  // on peut animer les splats ici. Par exemple :
  this.position[1] += speed * 0.05 * this.direction; // permet de déplacer le splat vers le haut au fil du temps
  this.position[0] += speed * 0.0007 * this.angle; // permet de déplacer le splat sur l'axe X
};

Splat.prototype.sendUniformVariables = function () {
  // envoie des variables au shader (position du splat, couleur, texture)
  // fonction appelée à chaque frame, avant le dessin du splat
  if (this.loaded) {
    gl.uniform3fv(splatShader.positionUniform, this.position);
    gl.uniform3fv(splatShader.couleurUniform, this.couleur);

    // how to send a texture:
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.splatTexture);
    gl.uniform1i(splatShader.texUniform, 0);
  }
};

Splat.prototype.draw = function () {
  // dessin du splat
  if (this.loaded) {
    gl.bindVertexArray(this.vao);
    gl.drawElements(
      gl.TRIANGLES,
      this.triangles.numItems,
      gl.UNSIGNED_SHORT,
      0
    );
    gl.bindVertexArray(null);
  }
};

Splat.prototype.clear = function () {
  // clear all GPU memory
  gl.deleteBuffer(this.vertexBuffer);
  gl.deleteBuffer(this.coordBuffer);
  gl.deleteVertexArray(this.vao);
  this.loaded = false;
};
