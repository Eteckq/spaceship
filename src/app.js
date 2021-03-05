var background;
var enemy;

var over = false

let cooldown = 0;

var waveManager 
var shipManager 


function drawScene() {
  shipManager.cooldown--;

  // initialisation du viewport
  gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);

  // efface les buffers de couleur et de profondeur
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  // dessin du fond (d�commenter pour travailler dessus)
  gl.useProgram(background.shader());
  background.sendUniformVariables();
  background.draw();

  gl.enable(gl.BLEND); // transparence activ�e

    if (shipManager.playerShoots.length > 0) {
      gl.useProgram(shipManager.playerShoots[0].shader());

      let alive = [];

      for (let sample of shipManager.playerShoots) {
        if (sample.position[1] > 1.5 || sample.position[1] < -1.5) {
          sample.clear();
        } else {
          
          sample.sendUniformVariables();
          sample.draw();

          if(!waveManager.killIfTouched(sample.position[0], sample.position[1])){
            alive.push(sample);
          }
        }
      }

      shipManager.playerShoots = alive;
    }

        if (shipManager.enemiesShoots.length > 0) {
      gl.useProgram(shipManager.enemiesShoots[0].shader());

      let alive = [];

      for (let sample of shipManager.enemiesShoots) {
        if (sample.position[1] > 1.5 || sample.position[1] < -1.5) {
          sample.clear();
        } else {
          alive.push(sample);
          sample.sendUniformVariables();
          sample.draw();

          if(shipManager.isColliding(sample.position[0], sample.position[1])){
            over = true
          }
        }
      }

      shipManager.enemiesShoots = alive;
    }

  if (waveManager.spawned.length > 0) {
    waveManager.spawned.forEach((enemy) => {
      gl.useProgram(enemy.shader());
      enemy.sendUniformVariables();
      enemy.draw();
    });
  }

  gl.disable(gl.BLEND);

  // dessin du vaisseau
  gl.useProgram(shipManager.spaceship.shader());
  shipManager.spaceship.sendUniformVariables();
  shipManager.spaceship.draw();
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
    shipManager.spaceship.setParameters(elapsed);
    background.setParameters(elapsed);
    shipManager.playerShoots.forEach((sample) => {
      sample.setParameters(elapsed);
      
    });
        shipManager.enemiesShoots.forEach((sample) => {
          sample.setParameters(elapsed);
        });
      waveManager.spawned.forEach((enemy) => {
        enemy.setParameters(elapsed);
      });
    

  }
  lastTime = timeNow;
}

function tick() {
  if(over) return;
  requestAnimFrame(tick);
  handleKeys();
  drawScene();
  animate();
  waveManager.tick()
}

function webGLStart() {

  // initialisation du canvas et des objets OpenGL
  var canvas = document.getElementById("SpaceShip");
  initGL(canvas);

  // test: cr�ation d'une texture

  initBackgroundShader();
  initModelShader();
  initSplatShader();
  initEnemyShader();

  //heightfield = new Heightfield();
  background = new Background();
  
  waveManager = new WaveManager();
  shipManager = new ShipManager();

  // la couleur de fond sera grise fonc�e
  gl.clearColor(0.3, 0.3, 0.3, 1.0);

  // active le test de profondeur
  gl.enable(gl.DEPTH_TEST);

  // fonction de m�lange utilis�e pour la transparence
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

  handleInputs();

  // dessine la scene
  tick();
}
