const COOLDOWN = 15

class ShipManager {
  cooldown = 0;
  multiShoot = 0;
  shootSamples = [];
  spaceship

  constructor() {
    this.spaceship = new Model();
  }

  shoot() {
    // SPACE
    if (this.cooldown <= 0) {
      this.cooldown = COOLDOWN;

      let { x, y, z } = this.getCoords();

      let newSplat = new Splat(20);
      let newSplat2 = new Splat(-20);
      let newSplat3 = new Splat();
      newSplat.setPosition(x, y, z);
      newSplat2.setPosition(x, y, z);
      newSplat3.setPosition(x, y, z);

      this.shootSamples.push(newSplat);
      this.shootSamples.push(newSplat2);
      this.shootSamples.push(newSplat3);
    }
  }

  getCoords() {
    // exemple: comment positionner un splat devant le vaisseau
    var p = this.spaceship.getBBox(); // boite englobante du vaisseau sur l'�cran
    var x = (p[0][0] + p[1][0]) / 2;
    var y = p[1][1];
    var z = p[1][2] + 0.005; // profondeur du splat (juste derri�re le vaisseau)

    return { x, y, z };
  }
}

