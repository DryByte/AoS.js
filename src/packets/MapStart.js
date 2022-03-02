const BasePacket = require("./BasePacket.js");
const VXL = require("../vxl/VXL.js");
const { UInt32Type } = require("../types");

class MapStart extends BasePacket {
	constructor(packet) {
		super();

		this.fields = {
			map_size: new UInt32Type()
		}

		if (packet)
			this.parseInfos(packet);
	}

	organize(game) {
		game.map = new VXL();
	}
}

module.exports = MapStart;