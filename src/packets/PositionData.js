const BasePacket = require("./BasePacket.js");
const { LEFloatType } = require("../types");

class PositionData extends BasePacket {
	constructor(packet) {
		super();

		this.id = 0;
		this.fields = {
			x: new LEFloatType(),
			y: new LEFloatType(),
			z: new LEFloatType()
		};

		if (packet)
			this.parseInfos(packet);
	}

	organize(game) {
		game.players[game.local.localPlayerId].position = {
			x: this.getValue("x"),
			y: this.getValue("y"),
			z: this.getValue("z")
		};
	}
}

module.exports = PositionData;