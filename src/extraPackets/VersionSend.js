const BasePacket = require("../packets/BasePacket.js");
const { ByteType, StringType } = require("../types");

class VersionSend extends BasePacket {
	constructor(packet) {
		super();

		this.id = 34;
		this.fields = {
			client_identifier: new ByteType(),
			version_major: new ByteType(),
			version_minor: new ByteType(),
			version_revision: new ByteType(),
			os: new StringType(),
		};

		if (packet)
			this.parseInfos(packet);
	}

	organize(game) {
		game.local.sendVersion();
	}
}

module.exports = VersionSend;