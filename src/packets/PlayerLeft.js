const BasePacket = require("./BasePacket.js");
const { UByteType } = require("../types");

/**
 * @category Packets
 * @extends {BasePacket}
 */
class PlayerLeft extends BasePacket {
	constructor(packet) {
		super();

		/**
		 * Packet Id
		 * @type Integer
		 */
		this.id = 20;

		/**
		 * Fields Object
		 * @property {UByteType} player_id Player's id
		 */
		this.fields = {
			player_id: new UByteType()
		};

		if (packet)
			this.parseInfos(packet);
	}

	organize(game) {
		game.players[this.getValue("player_id")] = undefined;
	}
}

module.exports = PlayerLeft;