const BasePacket = require("./BasePacket.js");

class MapStart extends BasePacket {
	constructor() {
		super();

		this.fields = {
			map_size: {type: "uint32", value: 0}
		}
	}
}

module.exports = MapStart;