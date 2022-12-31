const BasePacket = require("./BasePacket.js");
const { UByteType } = require("../types");

class SetColor extends BasePacket {
	constructor(packet) {
		super();

		this.id = 8;
		this.fields = {
			player_id: new UByteType(),
			blue:      new UByteType(),
			green:     new UByteType(),
			red:       new UByteType(),
		};

		if (packet)
			this.parseInfos(packet);
	}

	organize(game) {
		if (this.fields.player_id.value > 31)
			this.fields.player_id.value = 32;

		let playerC = game.players[this.getValue("player_id")];
		playerC.blockColor[0] = this.getValue("red");
		playerC.blockColor[1] = this.getValue("green");
		playerC.blockColor[2] = this.getValue("blue");
	}
}

module.exports = SetColor;