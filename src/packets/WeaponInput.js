const BasePacket = require("./BasePacket.js");
const { UByteType } = require("../types");

class WeaponInput extends BasePacket {
	constructor(packet) {
		super();

		this.id = 4;
		this.fields = {
			player_id:    new UByteType(),
			weapon_input: new UByteType()
		};

		if (packet)
			this.parseInfos(packet);
	}

	organize(game) {
		let player = game.players[this.getValue("player_id")];
		player.firing = this.getValue("weapon_input")&1;
	}

	setWeaponInput(primary, secondary){
		this.setValue("weapon_input", primary | (secondary<<1));
	}
}

module.exports = WeaponInput;