var currentlyPressedKeys = {};

function handleKeyDown(event) {
  currentlyPressedKeys[event.keyCode] = true;
}

function handleKeyUp(event) {
  currentlyPressedKeys[event.keyCode] = false;
}

function handleInputs(){
    document.onkeydown = handleKeyDown;
    document.onkeyup = handleKeyUp;
}

function handleKeys() {
  if (currentlyPressedKeys[68]) {
    // D
    shipManager.spaceship.move(1, 0);
  }

  if (currentlyPressedKeys[81]) {
    // Q
    shipManager.spaceship.move(-1, 0);
  }

  if (currentlyPressedKeys[90]) {
    // Z
    shipManager.spaceship.move(0, 1);
  }

  if (currentlyPressedKeys[83]) {
    // S
    shipManager.spaceship.move(0, -1);
  }

  if (currentlyPressedKeys[77]) {
    // M
    waveManager.spawnNewWave();
}

  if (currentlyPressedKeys[32]) {
    shipManager.shoot()
  }
}