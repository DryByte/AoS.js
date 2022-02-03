const BasePacket = require("./BasePacket.js");

class MapChunk extends BasePacket {
	constructor() {
		super()

		this.fields = {
			map_data: {type: "ubyte", value: 0}
		}
	}
}

module.exports = MapChunk;