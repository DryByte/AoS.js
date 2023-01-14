const BasePacket = require("../packets/BasePacket.js");
const { LEIntType } = require("../types");

class VersionHandshakeInit extends BasePacket {
	constructor(packet) {
		super();

		this.id = 31;
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