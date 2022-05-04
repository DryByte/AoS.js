const Decompressor = require("./Decompressor.js");

/**
 * @typedef {object} BlockInfo
 * @property {number} solid Solid state
 * @property {object} color Color object
 * @property {number} color.a Alpha color
 * @property {number} color.r Red color
 * @property {number} color.g Green color
 * @property {number} color.b Blue color
 */

/**
 * Class to manipulate .VXL files.
 * @category VXL Manipulation
 */
class VXL {
	constructor() {
		/**
		 * Decompressor class.
		 * @type {Decompressor}
		 */
		this.decompressor = new Decompressor();

		/**
		 * Decompressed map chunks.
		 * @type {Buffer}
		 */
		this.data;

		/**
		 * 1D Array with all block infos compacted into Uint32.
		 * @type {Uint32Array}
		 */
		this.blocks = new Uint32Array(512*512*64);
	}

	/**
	 * Get the block index in the 1D array, from 3D coordinate.
	 * @param {number} X X Coordinate
	 * @param {number} Y Y Coordinate
	 * @param {number} Z Z Coordinate
	 */
	getBlockIndex(x,y,z) {
		return (y*512*64)+(z*512)+x;
	}

	/**
	 * Get first block from the sky block to the bottom.
	 * @param {number} X X Coordinate
	 * @param {number} Y Y Coordinate
	 * 
	 * @returns {BlockInfo} Block infos.
	 */
	getTopBlock(x,y) {
		let to_r;
		for (let z = 0; z < 64; z++){
			let block = this.getBlock(x,y,z);

			if (block.solid) {
				to_r = block;
				break;
			}
		}

		return to_r;
	}

	// maybe merge getTopBlock and this...
	/**
	 * Get the coordinate from the first block from the sky to the bottom.
	 * @param {number} X X Coordinate
	 * @param {number} Y Y Coordinate
	 * 
	 * @returns {number} Block coordinates.
	 */
	getTopCoordinate(x,y) {
		let to_r = 0;
		for (let z = 0; z < 64; z++){
			let block = this.getBlock(x,y,z);

			if (block.solid) {
				to_r = z;
				break;
			}
		}

		return to_r;
	}

	/**
	 * Check if its possible to use Ace of Spades actions... Basically checks if the action will be inside the map limits.
	 * @param {number} X X Coordinate
	 * @param {number} Y Y Coordinate
	 * @param {number} Z Z Coordinate
	 * 
	 * @returns {boolean}
	 */
	canBlockAction(x,y,z) {
		if (x < 0 || x > 511)
			return 0;

		if (y < 0 || x > 511)
			return 0;

		if (z < 0 || z > 63)
			return 0;

		return 1;
	}

	/**
	 * Remove a block from the map.
	 * @param {number} X X Coordinate
	 * @param {number} Y Y Coordinate
	 * @param {number} Z Z Coordinate
	 */
	removeBlock(x,y,z) {
		if(!this.canBlockAction(x, y, z))
			return 0;

		let block_i = this.getBlockIndex(x, y, z);
		this.blocks[block_i] = 0;
		return 1;
	}

	/**
	 * Add a block to the map.
	 * @param {BlockInfo}
	 */
	addBlock(obj) {
		let pos = obj.position;
		let color = obj.color;

		if (!this.canBlockAction(pos.x, pos.y, pos.z))
			return 0;

		if (!color.a)
			color.a = 255;

		let block_i = this.getBlockIndex(pos.x, pos.y, pos.z);
		let infos_32 = this.convertTo32(1,color.r, color.g, color.b, color.a);

		this.blocks[block_i] = infos_32;
		return 1;
	}

	/**
	 * Get a block from specific coordinates.
	 * @param {number} X X Coordinate
	 * @param {number} Y Y Coordinate
	 * @param {number} Z Z Coordinate
	 * 
	 * @returns {BlockInfo}
	 */
	getBlock(x,y,z) {
		const base = this.blocks[this.getBlockIndex(x,y,z)];
		const block = {solid: 0, color: {a:0,r:0,g:0,b:0}};

		block.solid = base&1;
		block.color.a = base&255;
		block.color.r = base>>8&255;
		block.color.g = base>>16&255;
		block.color.b = base>>24&255;

		return block;
	}

	convertTo32(solid,r,g,b,a) {
		//(solid)∨(a«1)∨(r«8)∨(g«16)∨(b«24)
		let res = solid;
		res |= a<<1;
		res |= r << 8;
		res |= g << 16;
		res |= b << 24;

		return res;
	}

	/**
	 * Load VXL to the blocks array from data variable.
	 */
	loadVXL() {
		let x = 0,
			y = 0,
			z = 0;

		let offset = 0;

		for (y = 0; y < 512; y++) {
			for (x = 0; x < 512; x++) {
				for (z = 0; z < 64; z++) {
					this.blocks[this.getBlockIndex(x,y,z)] = this.convertTo32(1,0,0,0,0);
				}
				z=0;

				/* eslint-disable-next-line no-constant-condition */
				while(1) {
					let number_4byte_chunks = this.data[offset];
					let top_color_start = this.data[offset+1];
					let top_color_end = this.data[offset+2];

					let len_bottom = top_color_end-top_color_start+1;
					let len_top = (number_4byte_chunks-1) - len_bottom;

					for (let i = z; i < top_color_start; i++) {
						this.blocks[this.getBlockIndex(x,y,i)] = 0;
					}

					for (z = top_color_start; z <= top_color_end; z++) {
						let b = this.data[offset+4],
							g = this.data[offset+5],
							r = this.data[offset+6],
							a = this.data[offset+7];
						let block_i = this.getBlockIndex(x,y,z);

						this.blocks[block_i] = this.convertTo32(1,r,g,b,a);
					}

					if(!number_4byte_chunks) {
						offset+=4*(len_bottom+1);
						break;
					}

					offset += this.data[offset]*4;

					let air_start = this.data[offset+3];
					let air_end = air_start - len_top;

					for(z = air_start; z < air_end; z++) {
						let b = this.data[offset+4],
							g = this.data[offset+5],
							r = this.data[offset+6],
							a = this.data[offset+7];
						let block_i = this.getBlockIndex(x,y,z);

						this.blocks[block_i] = this.convertTo32(1,r,g,b,a);
					}
				}
			}
		}

		return 1;
	}
}

module.exports = VXL;