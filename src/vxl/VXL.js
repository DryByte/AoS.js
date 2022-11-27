const Decompressor = require("./Decompressor.js");

/**
 * @typedef {object} Position
 * @property {number} x X axis
 * @property {number} y Y axis
 * @property {number} z Z axis
 */

/**
 * @typedef {object} BlockColor
 * @property {number} a Alpha color
 * @property {number} r Red color
 * @property {number} g Green color
 * @property {number} b Blue color
 */

/**
 * @typedef {object} BlockInfo
 * @property {number} solid Solid state
 * @property {Position} position Block position
 * @property {BlockColor} color Color object
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
	 * @param {BlockInfo} Block to be added to the map
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
	 * Add a block line to the map.
	 * @param {Position} Position1 Position of the start block
	 * @param {Position} Position2 Position of the end block
	 * @param {BlockColor} Color The block color
	 */
	addBlockLine(pos1, pos2, color) {
		let c = {x: pos1.x, y: pos1.y, z: pos1.z};
		let d = {x: pos2.x-c.x, y: pos2.y-c.y, z: pos2.z-c.z};

		// direction indicators for building
		let ixi, iyi, izi, dx, dy, dz, dxi, dyi, dzi;

		ixi = d.x<0 ? -1 : 1;
		iyi = d.y<0 ? -1 : 1;
		izi = d.z<0 ? -1 : 1;

		if (Math.abs(d.x) >= Math.abs(d.y) && Math.abs(d.x) >= Math.abs(d.z)) {
			dxi = 1024;
			dx  = 512;
			dyi = !d.y ? 0x3fffffff/512 : Math.abs(d.x*1024/d.y);
			dy  = dyi/2;
			dzi = !d.z ? 0x3fffffff/512 : Math.abs(d.x*1024/d.z);
			dz  = dzi/2;
		} else if (Math.abs(d.y) >= Math.abs(d.z)) {
			dyi = 1024;
			dy  = 512;
			dxi = !d.x ? 0x3fffffff/512 : Math.abs(d.y*1024/d.x);
			dx  = dxi/2;
			dzi = !d.z ? 0x3fffffff/512 : Math.abs(d.y*1024/d.z);
			dz  = dzi/2;
		} else {
			dzi = 1024;
			dz  = 512;
			dxi = !d.x ? 0x3fffffff/512 : Math.abs(d.z*1024/d.x);
			dx  = dxi/2;
			dyi = !d.y ? 0x3fffffff/512 : Math.abs(d.z*1024/d.y);
			dy  = dyi/2;
		}

		if (ixi >= 0)
			dx = dxi-dx;
		if (iyi >= 0)
			dy = dyi-dy;
		if (izi >= 0)
			dz = dzi-dz;

		let count = 0;
		let blocks = [];
		/* eslint-disable-next-line no-constant-condition */
		while(1) {
			blocks[count] = structuredClone(c);
			if (count++ == 63)
				break;

			if (c.x == pos2.x && c.y == pos2.y && c.z == pos2.z)
				break;

			if (dz <= dx && dz <= dy) {
				c.z += izi;
				if (c.z < 0 || c.z >= 64)
					break;
				dz += dzi;
			} else {
				if (dx < dy) {
					c.x += ixi;
					if (c.x >= 512)
						break;
					dx += dxi;
				} else {
					c.y += iyi;
					if (c.y >= 512)
						break;
					dy += dyi;
				}
			}
		}

	
		for (let position of blocks) {
			this.addBlock({position, color});
		}

		return blocks.length;

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
		const block = {solid: 0, position: {x,y,z}, color: {a:0,r:0,g:0,b:0}};

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