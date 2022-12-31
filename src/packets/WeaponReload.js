const BasePacket = require("./BasePacket.js");
const { UByteType } = require("../types");

class WeaponReload extends BasePacket {
	constructor(packet) {
		super();

		this.id = 28;
		this.fields = {
			player_id: new UByteType(),
			clip:      new UByteType(),
			reserve:   new UByteType()
		};

		if (packet)
			this.parseInfos(packet);
	}

	organize(game) {
		let playerC = game.players[this.getValue("player_id")];
		playerC.weaponClip = this.getValue("clip");
		playerC.weaponReserve = this.getValue("reserve");
	}
}

module.exports = WeaponReload;