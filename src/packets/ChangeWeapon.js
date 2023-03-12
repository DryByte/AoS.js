const BasePacket = require("./BasePacket.js");
const { UByteType } = require("../types");

/**
 * @category Packets
 * @extends {BasePacket}
 */
class ChangeWeapon extends BasePacket {
	constructor(packet) {
		super();

		/**
		 * Packet Id
		 * @type Integer
		 */
		this.id = 30;

		/**
		 * Fields Object
		 * @property {UByteType} player_id Player's id
		 * @property {UByteType} weapon_id Weapon ID to change
		 */
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