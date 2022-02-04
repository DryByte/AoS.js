const BasePacket = require("./BasePacket.js");

class MapChunk extends BasePacket {
	constructor(packet) {
		super()

		this.fields = {
			map_data: {type: "ubyte", value: 0}
		}

		if (packet)
			this.parseInfos(packet);
	}
}

module.exports = MapChunk;