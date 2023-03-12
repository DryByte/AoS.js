const BasePacket = require("../packets/BasePacket.js");
const { LEIntType } = require("../types");

/**
 * Server starts handshake for version info
 * @category Ext Packets
 * @extends {BasePacket}
 */
class VersionHandshakeInit extends BasePacket {
	constructor(packet) {
		super();

		/**
		 * Packet Id
		 * @type Integer
		 */
		this.id = 31;

		/**
		 * Fields Object
		 * @property {LEIntType} challenge Number sent to validate handshake
		 */
		this.fields = {
			challenge: new LEIntType(),
		};

		if (packet)
			this.parseInfos(packet);
	}

	organize(game) {
		game.local.sendVersionHandshake(this.getValue("challenge"));
	}
}

module.exports = VersionHandshakeInit;