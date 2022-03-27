const BasePacket = require("./BasePacket.js");
const { LEFloatType } = require("../types");

class PositionData extends BasePacket {
	constructor(packet) {
		super();

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
			x: this.fields.x.value,
			y: this.fields.y.value,
			z: this.fields.z.value
		};
	}
}

module.exports = PositionData;