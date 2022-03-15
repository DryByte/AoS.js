const BasePacket = require("./BasePacket.js");

class MapChunk extends BasePacket {
	constructor(packet) {
		super();

		this.fields = {
			map_data: packet
		};
	}

	organize(game){
		game.map.decompressor.addChunk(this.fields.map_data);
	}
}

module.exports = MapChunk;