const BasePacket = require("./BasePacket.js");
const { UByteType } = require("../types");

class PlayerLeft extends BasePacket {
	constructor(packet) {
		super();

		this.id = 20;
		this.fields = {
			player_id: new UByteType()
		};

		if (packet)
			this.parseInfos(packet);
	}

	organize(game) {
		game.players[this.fields.player_id.value] = undefined;
	}
}

module.exports = PlayerLeft;