class WaveManager {
  wave = 0;
  spawned = [];

  score = 0;

  cooldown = 500;

  scoreInput;

  constructor() {
    this.scoreInput = document.getElementById("score");
    console.log(this.scoreInput);
  }

  spawnNewWave() {
    this.cooldown = 500;
    this.wave++;
    for (let i = 0; i < 4; i++) {
      enemy = new Enemy();
      enemy.setPosition(Math.random() * 1.5 - 0.8, 0.8, -0.9);
      this.spawned.push(enemy);
    }
  }

  killIfTouched(x, y) {
    let alive = [];
    let killed = false;
    for (const enemy of this.spawned) {
      if (enemy.isColliding(x, y)) {
        console.log("Dead !");
        killed = true;
        this.score++;
        this.scoreInput.innerHTML="Score: " + this.score;
      } else {
        alive.push(enemy);
      }
    }
    this.spawned = alive;
    return killed;
  }

  tick() {
    if (this.cooldown <= 0 || this.spawned.length === 0) {
      this.spawnNewWave();
    }

    this.cooldown--;
  }
}
