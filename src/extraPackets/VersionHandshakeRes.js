const BasePacket = require("../packets/BasePacket.js");
const { LEIntType } = require("../types");

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