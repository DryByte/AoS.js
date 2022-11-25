const Team = require("./Team.js");

/**
 * Class representing the Game config.
 * @category Match Infos
 */
class Game {
	constructor(host) {
		this.players = new Array(33);
		this.fog = new Array(3);
		//this.map = new VXL();
		this.blueTeam = new Team(0);
		this.greenTeam = new Team(1);
		this.spectatorTeam = new Team(-1);

		this.gamemode = 0;
		this.cps;
		this.local = host;
		this.map;
	}
}

module.exports = Game;