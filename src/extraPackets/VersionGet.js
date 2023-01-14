const BasePacket = require("../packets/BasePacket.js");

class VersionGet extends BasePacket {
	constructor(packet) {
		super();

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