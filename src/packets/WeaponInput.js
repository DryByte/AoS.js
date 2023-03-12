const BasePacket = require("./BasePacket.js");
const { UByteType } = require("../types");

/**
 * @category Packets
 * @extends {BasePacket}
 */
class WeaponInput extends BasePacket {
	constructor(packet) {
		super();

		/**
		 * Packet Id
		 * @type Integer
		 */
		this.id = 4;

		/**
		 * Fields Object
		 * @property {UByteType} player_id Player's id
		 * @property {UByteType} weapon_input The lowest bit represents the primary fire, the second lowest represents the secondary fire.
		 */
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

	/**
	 * Enable/disable weapon inputs
	 * @param {boolean} Primary Primary fire
	 * @param {boolean} Secondary Secondary fire
	 */
	setWeaponInput(primary, secondary){
		this.setValue("weapon_input", primary | (secondary<<1));
	}
}

module.exports = WeaponInput;