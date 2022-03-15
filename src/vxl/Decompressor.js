const zlib = require("zlib");

class Decompressor {
	constructor() {
		this.chunk_data = Buffer.alloc(2024*2024);
		this.chunk_offset = 0;
	}

	exec() {
		let output = zlib.inflateSync(this.chunk_data);
		return output;
	}

	addChunk(chunk) {
		chunk.copy(this.chunk_data, this.chunk_offset, 1);
		this.chunk_offset+=chunk.length-1;
	}
}

module.exports = Decompressor;