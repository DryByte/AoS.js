const BasePacket = require("./BasePacket.js");
const { UByteType } = require("../types");

/**
 * @category Packets
 * @extends {BasePacket}
 */
class SetTool extends BasePacket {
	constructor(packet) {
		super();

		/**
		 * Packet Id
		 * @type Integer
		 */
		this.id = 7;

		/**
		 * Fields Object
		 * @property {UByteType} player_id Player's id
		 * @property {UByteType} tool Tool id
		 */
		this.fields = {
			player_id: new UByteType(),
			tool:      new UByteType(),
		};

		if (packet)
			this.parseInfos(packet);
	}

	organize(game) {
		if (this.fields.player_id.value > 31)
			this.fields.player_id.value = 32;

		let playerC = game.players[this.getValue("player_id")];
		playerC.tool = this.getValue("tool");
	}
}

module.exports = SetTool;