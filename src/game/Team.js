/**
 * Class representing a Team in-game.
 * @category Match Infos
 */
class Team {
	constructor() {
		this.color = new Array(3);
		this.name = "";
		this.score = 0;

		this.base = new Array(3);
		this.intel = new Array(3);
	}
}

module.exports = Team;