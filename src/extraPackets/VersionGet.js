const BasePacket = require("../packets/BasePacket.js");

/**
 * Tells the client to send version info
 * @category Ext Packets
 * @extends {BasePacket}
 */
class VersionGet extends BasePacket {
	constructor(packet) {
		super();

		/**
		 * Packet Id
		 * @type Integer
		 */
		this.id = 33;
		this.fields = {};

		if (packet)
			this.parseInfos(packet);
	}

	organize(game) {
		game.local.sendVersion();
	}
}

module.exports = VersionGet;