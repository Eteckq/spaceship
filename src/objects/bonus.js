var bonusShader;

function initBonusShader() {
    bonusShader = initShaders("splat-vs", "splat-fs");

  // active ce shader
  gl.useProgram(bonusShader);

  // adresse des variables uniform dans le shader
  bonusShader.positionUniform = gl.getUniformLocation(bonusShader, "uPosition");
  bonusShader.texUniform = gl.getUniformLocation(bonusShader, "uTex");
  bonusShader.couleurUniform = gl.getUniformLocation(bonusShader, "maCouleur");

  // console.log("bonus shader initialized");
}

function Bonus() {
  // la texture est donnée en paramètre et stockée ici
  // elle est déjà chargée sur le GPU (carte graphique)
  this.bonusTexture = initTexture("textures/PNG/Power-ups/pill_blue.png");
  this.initParameters();

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

  // console.log("bonus initialized");
}

Bonus.prototype.shader = function () {
  return bonusShader;
};

Bonus.prototype.initParameters = function () {
  // paramètres par défaut d'un bonus (taille, position, couleur)
  this.width = .3;
  this.height = .4;
  this.position = [0.0, 0.0, 0.0];
  this.couleur = [1, 0, 0];
  this.time = 0.0;
  this.directionX = Math.random() - 0.5;
  this.directionY = Math.random() - 0.5;
};

Bonus.prototype.setPosition = function (x, y, z) {
  this.position = [x, y, z];
};

Bonus.prototype.isColliding = function(x, y){
    let pos = {x: this.position[0], y: this.position[1]};
    let hitbox = 0.05;

    let box = {
      x1: pos.x - hitbox,
      x2: pos.x + hitbox,
      y1: pos.y - hitbox * 2,
      y2: pos.y + hitbox * 2,
    };

    if (x > box.x1 && x < box.x2 && y > box.y1 && y < box.y2) {
     return true
    }
    return false
  }

Bonus.prototype.setParameters = function (elapsed) {
  this.time += 0.01 * elapsed;
  let speed = 0.8;

  if (Math.round(Math.random() * 150) === 0) {
    this.shoot();
  }

  if (Math.round(Math.random() * 1000) === 0) {
    this.directionX = -this.directionX;
  }
  if (Math.round(Math.random() * 500) === 0) {
    this.directionY = -this.directionY;
  }

  let newX = speed * 0.03 * this.directionX;
  if (this.position[0] - newX < -1.2 || this.position[0] - newX > 1.2) {
    this.directionX = -this.directionX;
    newX = -newX;
  }

  let newY = speed * 0.01 * this.directionY;
  if (this.position[1] - newY < -0.5 || this.position[1] - newY > 1.2) {
    this.directionY = -this.directionY;
    newY = -newY;
  }

  this.position[1] -= newY;
  this.position[0] -= newX;
};

Bonus.prototype.sendUniformVariables = function () {
  // envoie des variables au shader (position du bonus, couleur, texture)
  // fonction appelée à chaque frame, avant le dessin du bonus
  if (this.loaded && bonusShader) {
    gl.uniform3fv(bonusShader.positionUniform, this.position);
    gl.uniform3fv(bonusShader.couleurUniform, this.couleur);

    // how to send a texture:
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.bonusTexture);
    gl.uniform1i(bonusShader.texUniform, 0);
  }
};

Bonus.prototype.draw = function () {
  // dessin du bonus
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

Bonus.prototype.clear = function () {
  // clear all GPU memory
  gl.deleteBuffer(this.vertexBuffer);
  gl.deleteBuffer(this.coordBuffer);
  gl.deleteVertexArray(this.vao);
  this.loaded = false;
};
