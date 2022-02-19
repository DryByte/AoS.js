const BasePacket = require("./BasePacket.js");

class SetColor extends BasePacket {
	constructor(packet) {
		super()

		this.fields = {
			player_id: {type: "ubyte", value: 0},
			blue:      {type: "ubyte", value: 0},
			green:     {type: "ubyte", value: 0},
			red:       {type: "ubyte", value: 0},
		};

		if (packet)
			this.parseInfos(packet);
	}

	organize(game) {
		let playerC = game.players[this.fields.player_id.value];
		playerC.blockColor[0] = this.fields.red.value;
		playerC.blockColor[1] = this.fields.green.value;
		playerC.blockColor[2] = this.fields.blue.value;
	}
}

module.exports = SetColor;