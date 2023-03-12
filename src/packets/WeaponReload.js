const BasePacket = require("./BasePacket.js");
const { UByteType } = require("../types");

/**
 * @category Packets
 * @extends {BasePacket}
 */
class WeaponReload extends BasePacket {
	constructor(packet) {
		super();

		/**
		 * Packet Id
		 * @type Integer
		 */
		this.id = 28;

		/**
		 * Fields Object
		 * @property {UByteType} player_id Player's id
		 * @property {UByteType} clip AMMO in clip
		 * @property {UByteType} reserve AMMO in reserve
		 */
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