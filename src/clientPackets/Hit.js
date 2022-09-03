const BasePacket = require("../packets/BasePacket.js");
const { UByteType } = require("../types");

class Hit extends BasePacket {
	constructor(packet) {
		super();

		this.fields = {
			player_id: new UByteType(),
			hit_type:  new UByteType(),
		};

		if (packet)
			this.parseInfos(packet);
	}
}

module.exports = Hit;