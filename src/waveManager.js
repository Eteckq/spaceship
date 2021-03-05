class WaveManager {
  difficulty = 0;
  spawned = [];

  cooldown = 1000;

  constructor() {
      
  }

  spawnNewWave() {
    for (let i = 0; i < 4; i++) {
      if (this.difficulty === 0) {
        enemy = new Enemy();
        enemy.setPosition(Math.random()*1.5-0.8, 0.8, -0.9);
        this.spawned.push(enemy);
      }
    }
  }

  tick(){
    this.cooldown--;
  }
}
