const BasePacket = require("./BasePacket.js");
const { UByteType } = require("../types");

class ChangeWeapon extends BasePacket {
	constructor(packet) {
		super();

		this.id = 30;
		this.fields = {
			player_id:    new UByteType(),
			weapon_id:    new UByteType(),
		};

		if (packet)
			this.parseInfos(packet);
	}

	organize(game) {
		let player = game.players[this.getValue("player_id")];
		if (!player)
			return;

		player.weapon = this.getValue("weapon_id");
	}
}

module.exports = ChangeWeapon;