/**
 * Class representing In-game players.
 * @category Match Infos
 */
class Player {
	constructor() {
		this.name = "Deuce";
		this.playerId = 0;
		this.kills = 0;
		this.position = {x: 0, y: 0, z: 0};
		this.orientation = {x: 0, y: 0, z: 0};
		this.inputs = {up: false, down: false, left: false, right: false, jump: false, crouch: false, sneak: false, sprint: false};
		this.blockColor = new Array(3);
		this.weapon = 0;
		this.weaponClip = 0;
		this.weaponReserve = 0;
		this.firing = false;
		this.tool = 0;
		this.blocks = 50; // for client this is kinda useless...
		this.team;
	}
}

module.exports = Player;