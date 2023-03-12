const BasePacket = require("./BasePacket.js");
const { UByteType } = require("../types");

/**
 * @category Packets
 * @extends {BasePacket}
 */
class IntelPickup extends BasePacket {
	constructor(packet) {
		super();

		/**
		 * Packet Id
		 * @type Integer
		 */
		this.id = 24;

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
		let player = game.players[this.getValue("player_id")];
		if (!player)
			return;

		player.team.hasIntel = player.playerId;
	}
}

module.exports = IntelPickup;