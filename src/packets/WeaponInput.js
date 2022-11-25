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
		let player = game.players[this.fields.player_id.value];
		player.firing = this.fields.weapon_input.value&1;
	}

	setWeaponInput(primary,secundary){
		this.fields.weapon_input.value = primary | (secundary<<1);
	}
}

module.exports = WeaponInput;