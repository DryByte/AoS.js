const BasePacket = require("./BasePacket.js");
const { UByteType } = require("../types");

class SetTool extends BasePacket {
	constructor(packet) {
		super();

		this.id = 7;
		this.fields = {
			player_id: new UByteType(),
			tool:      new UByteType(),
		};

		if (packet)
			this.parseInfos(packet);
	}

	organize(game) {
		if (this.fields.player_id.value > 31)
			this.fields.player_id.value = 32;

		let playerC = game.players[this.getValue("player_id")];
		playerC.tool = this.getValue("tool");
	}
}

module.exports = SetTool;