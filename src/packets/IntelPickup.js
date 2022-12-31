const BasePacket = require("./BasePacket.js");
const { UByteType } = require("../types");

class IntelPickup extends BasePacket {
	constructor(packet) {
		super();

		this.id = 24;
		this.fields = {
			player_id: new UByteType()
		};

		if (packet)
			this.parseInfos(packet);
	}

	organize(game) {
		let player = game.players[this.getValue("player_id")];
		if (!player)
			return;

		player.team.hasIntel = player.playerId;
	}
}

module.exports = IntelPickup;