/**
 * Class representing a Team in-game.
 * @category Match Infos
 */
class Team {
	constructor(id) {
		this.color = new Array(3);
		this.name = "";
		this.id = id;
		this.score = 0;

		this.base = new Array(3);
		this.intel = new Array(3);
	}
}

module.exports = Team;