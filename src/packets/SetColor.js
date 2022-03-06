const BasePacket = require("./BasePacket.js");
const { UByteType } = require("../types");

class SetColor extends BasePacket {
	constructor(packet) {
		super()

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

		let playerC = game.players[this.fields.player_id.value];
		playerC.blockColor[0] = this.fields.red.value;
		playerC.blockColor[1] = this.fields.green.value;
		playerC.blockColor[2] = this.fields.blue.value;
	}
}

module.exports = SetColor;