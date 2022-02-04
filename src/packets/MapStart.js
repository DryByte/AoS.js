const BasePacket = require("./BasePacket.js");

class MapStart extends BasePacket {
	constructor(packet) {
		super();

		this.fields = {
			map_size: {type: "uint32", value: 0}
		}

		if (packet)
			this.parseInfos(packet);
	}
}

module.exports = MapStart;