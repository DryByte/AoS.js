const BasePacket = require("../packets/BasePacket.js");
const { LEIntType } = require("../types");

/**
 * Response for a VersionHandshakeInit
 * @category Ext Packets
 * @extends {BasePacket}
 */
class VersionHandshakeRes extends BasePacket {
	constructor(packet) {
		super();

		this.id = 32;
		this.fields = {
			challenge: new LEIntType(),
		};

		if (packet)
			this.parseInfos(packet);
	}
}

module.exports = VersionHandshakeRes;