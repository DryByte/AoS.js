const zlib = require("zlib");

/**
 * Decompress zlib VXL chunks.
 * @category VXL Manipulation
 */
class Decompressor {
	constructor() {
		this.chunk_data = Buffer.alloc(2024*2024);
		this.chunk_offset = 0;
	}

	/**
	 * Decompress all chunks from chunk_data.
	 * 
	 * @returns {Buffer}
	 */
	exec() {
		let output = zlib.inflateSync(this.chunk_data);
		return output;
	}

	/**
	 * Add a new chunk to chunk_data buffer.
	 * 
	 * @param {Buffer} Chunk Chunk data.
	 */
	addChunk(chunk) {
		chunk.copy(this.chunk_data, this.chunk_offset, 1);
		this.chunk_offset+=chunk.length-1;
	}
}

module.exports = Decompressor;