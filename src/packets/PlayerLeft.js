const BasePacket = require("./BasePacket.js");
const { UByteType } = require("../types");

class PlayerLeft extends BasePacket {
	constructor(packet) {
		super()

		this.fields = {
			player_left: new UByteType()
		};

		if (packet)
			this.parseInfos(packet);
	}

	organize(game) {
		game.players[this.fields.player_left.value] = undefined;
	}
}

module.exports = PlayerLeft;