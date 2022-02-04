const BasePacket = require("./BasePacket.js");

class PlayerLeft extends BasePacket {
	constructor(packet) {
		super()

		this.fields = {
			player_left: {type: "ubyte", value: 0}
		};

		if (packet)
			this.parseInfos(packet);
	}

	organize(game) {
		game.players[this.fields.player_left.value] = undefined;
	}
}

module.exports = PlayerLeft;