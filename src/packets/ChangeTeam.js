const BasePacket = require("./BasePacket.js");
const { UByteType, ByteType } = require("../types");

/**
 * @category Packets
 * @extends {BasePacket}
 */
class ChangeTeam extends BasePacket {
	constructor(packet) {
		super();

		/**
		 * Packet Id
		 * @type Integer
		 */
		this.id = 29;

		/**
		 * Fields Object
		 * @property {UByteType} player_id Player's id
		 * @property {ByteType} team_id Team ID to change
		 */
		this.fields = {
			player_id:    new UByteType(),
			team_id:      new ByteType(),
		};

		if (packet)
			this.parseInfos(packet);
	}
}

module.exports = ChangeTeam;