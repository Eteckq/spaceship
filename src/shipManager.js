const COOLDOWN = 15

class ShipManager {
	cooldown = 0;
	multiShoot = 1;
	playerShoots = [];
	enemiesShoots = [];
	spaceship;

	constructor() {
		this.spaceship = new Model();
	}

	shoot() {
		// SPACE
		if (this.cooldown <= 0) {
			this.cooldown = COOLDOWN;
			let angles = [0, 20, -20, 40, -40];
			let { x, y, z } = this.getCoords();
			for (let i = 0; i < this.multiShoot; i++) {
				let newSplat = new Splat(angles[i]);
				newSplat.setPosition(x, y, z);
				this.playerShoots.push(newSplat);
			}
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

	isColliding(x, y) {
		let position = this.getCoords();
		let hitbox = 0.03;

		let box = {
			x1: position.x - hitbox,
			x2: position.x + hitbox,
			y1: position.y - hitbox * 2,
			y2: position.y + hitbox * 2,
		};

		if (x > box.x1 && x < box.x2 && y > box.y1 && y < box.y2) {
			return true
		}

		return false
	}
}

