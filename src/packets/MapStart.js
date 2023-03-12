const BasePacket = require("./BasePacket.js");
const VXL = require("../vxl/VXL.js");
const { UInt32Type } = require("../types");

/**
 * @category Packets
 * @extends {BasePacket}
 */
class MapStart extends BasePacket {
	constructor(packet) {
		super();

		/**
		 * Packet Id
		 * @type Integer
		 */
		this.id = 18;

		/**
		 * Fields Object
		 * @property {UInt32Type} map_size The map size
		 */
		this.fields = {
			map_size: new UInt32Type()
		};

		if (packet)
			this.parseInfos(packet);
	}

	organize(game) {
		game.map = new VXL();
	}
}

module.exports = MapStart;