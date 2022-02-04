const Team = require("./Team.js");

class Game {
	constructor(host) {
		this.players = new Array(32);
		this.fog = new Array(3);
		//this.map = new VXL();
		this.blueTeam = new Team();
		this.greenTeam = new Team();
		this.spectatorTeam = new Team();

		this.gamemode = 0;
		this.cps;
		this.local = host;
	}
}

module.exports = Game;