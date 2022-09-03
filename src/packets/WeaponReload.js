const BasePacket = require("./BasePacket.js");
const { UByteType } = require("../types");

class WeaponReload extends BasePacket {
	constructor(packet) {
		super();

		this.fields = {
			player_id: new UByteType(),
			clip:      new UByteType(),
			reserve:   new UByteType()
		};

		if (packet)
			this.parseInfos(packet);
	}

	organize(game) {
		let playerC = game.players[this.fields.player_id.value];
		playerC.weaponClip = this.fields.clip.value;
		playerC.weaponReserve = this.fields.reserve.value;
	}
}

module.exports = WeaponReload;