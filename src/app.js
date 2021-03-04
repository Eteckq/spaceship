var background;
var spaceship;
var shootSample = [];

let cooldown = 0;

function drawScene() {
  cooldown--;

  // initialisation du viewport
  gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);

  // efface les buffers de couleur et de profondeur
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  // dessin du fond (d�commenter pour travailler dessus)
  gl.useProgram(background.shader());
  background.sendUniformVariables();
  background.draw();

  gl.enable(gl.BLEND); // transparence activ�e

  if (shootSample.length > 0) {
    gl.enable(gl.BLEND); // transparence activ�e
    gl.useProgram(shootSample[0].shader());

    let alive = [];

    for (let sample of shootSample) {
      if (sample.position[1] > 1.5) {
        sample.clear();
      } else {
        alive.push(sample);
        sample.sendUniformVariables();
        sample.draw();
      }
    }

    shootSample = alive;

    gl.disable(gl.BLEND);
  }

  // dessin du vaisseau
  gl.useProgram(spaceship.shader());
  spaceship.sendUniformVariables();
  spaceship.draw();
}

// une bonne maniere de gerer les evenements claviers
var currentlyPressedKeys = {};

function handleKeyDown(event) {
  currentlyPressedKeys[event.keyCode] = true;
}

function handleKeyUp(event) {
  currentlyPressedKeys[event.keyCode] = false;
}

function handleKeys() {
  // vous pouvez utiliser ce genre de fonction
  // pour faire bouger votre vaisseau
  // par exemple :

  if (currentlyPressedKeys[68]) {
    // D
    spaceship.move(1, 0);
  }

  if (currentlyPressedKeys[81]) {
    // Q
    spaceship.move(-1, 0);
  }

  if (currentlyPressedKeys[90]) {
    // Z
    spaceship.move(0, 1);
  }

  if (currentlyPressedKeys[83]) {
    // S
    spaceship.move(0, -1);
  }

  if (currentlyPressedKeys[77]) {
    // M
    // juste un test pour supprimer un splat (tir)
    shootSample.clear();
  }

  if (currentlyPressedKeys[32] && cooldown <= 0) {
    // SPACE
    cooldown = 10;

    // exemple: comment positionner un splat devant le vaisseau
    var p = spaceship.getBBox(); // boite englobante du vaisseau sur l'�cran
    var x = (p[0][0] + p[1][0]) / 2;
    var y = p[1][1];
    var z = p[1][2] + 0.005; // profondeur du splat (juste derri�re le vaisseau)

    let newSplat = new Splat(20);
    let newSplat2 = new Splat(-20);
    let newSplat3 = new Splat();
    newSplat.setPosition(x, y, z);
    newSplat2.setPosition(x, y, z);
    newSplat3.setPosition(x, y, z);

    shootSample.push(newSplat);
    shootSample.push(newSplat2);
    shootSample.push(newSplat3);
  }
}

function mouseMove(event) {
  // recup evenement souris
  //var newx = 2.0*(event.clientX/gl.viewportWidth)-1.0;
  //var newy = -(2.0*(event.clientY/gl.viewportHeight)-1.0);
}

// animation
var lastTime = 0;
function animate() {
  // fonction appel�e � chaque frame, permet d'animer la sc�ne
  var timeNow = new Date().getTime();
  if (lastTime != 0) {
    // anime chacun des objets de la scene
    // si necessaire (en fonction du temps ecoul�)
    var elapsed = timeNow - lastTime;
    spaceship.setParameters(elapsed);
    background.setParameters(elapsed);
    shootSample.forEach((sample) => {
      sample.setParameters(elapsed);
    });
  }
  lastTime = timeNow;
}

function tick() {
  requestAnimFrame(tick);
  handleKeys();
  drawScene();
  animate();
}

function webGLStart() {
  // initialisation du canvas et des objets OpenGL
  var canvas = document.getElementById("SpaceShip");
  initGL(canvas);

  // test: cr�ation d'une texture

  initBackgroundShader();
  initModelShader();
  initSplatShader();

  //heightfield = new Heightfield();
  background = new Background();
  spaceship = new Model("models/plane.obj");

  // la couleur de fond sera grise fonc�e
  gl.clearColor(0.3, 0.3, 0.3, 1.0);

  // active le test de profondeur
  gl.enable(gl.DEPTH_TEST);

  // fonction de m�lange utilis�e pour la transparence
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

  /* Mouse and keyboard interaction functions */
  //canvas.addEventListener('mousedown', tbMouseDown, true);
  //canvas.addEventListener('mousemove', mouseMove, true);
  //canvas.addEventListener('mouseup', tbMouseUp, true);
  document.onkeydown = handleKeyDown;
  document.onkeyup = handleKeyUp;

  // dessine la scene
  tick();
}
