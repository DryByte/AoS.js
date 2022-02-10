const BasePacket = require("./BasePacket.js");
const VXL = require("../vxl/VXL.js");

class MapStart extends BasePacket {
	constructor(packet) {
		super();

		this.fields = {
			map_size: {type: "uint32", value: 0}
		}

		if (packet)
			this.parseInfos(packet);
	}

	organize(game) {
		game.map = new VXL();
	}
}

module.exports = MapStart;