const BasePacket = require("./BasePacket.js");

/**
 * @category Packets
 * @extends {BasePacket}
 */
class MapChunk extends BasePacket {
	constructor(packet) {
		super();

		/**
		 * Packet Id
		 * @type Integer
		 */
		this.id = 19;

		/**
		 * Fields Object
		 * @property {Buffer} map_data Buffer with chunk data
		 */
		this.fields = {
			map_data: packet
		};
	}

	organize(game){
		game.map.decompressor.addChunk(this.fields.map_data);
	}
}

module.exports = MapChunk;