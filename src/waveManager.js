class WaveManager {
  wave = 0;
  spawned = [];
  bonus = undefined;
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
    if(Math.random()*100 <= 10){
      this.bonus = new Bonus();
      this.bonus.setPosition(Math.random() * 1.5 - 0.8, 0.8, -0.9);
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
    this.scoreInput.innerHTML = this.score;
      } else {
        alive.push(enemy);
      }
    }
    this.spawned = alive;
    return killed;
  }

  takeBonus(x,y){
    let takeBonus = false;
      if (this.bonus != undefined && this.bonus.isColliding(x, y)) {
        console.log("Bonus !");
        takeBonus = true;
      }
      return takeBonus;
  }

  tick() {
    if (this.cooldown <= 0 || this.spawned.length === 0) {
      this.spawnNewWave();
    }

    this.cooldown--;
  }

  
}
