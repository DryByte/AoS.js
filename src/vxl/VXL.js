const Decompressor = require("./Decompressor.js");

class VXL {
	constructor() {
		this.decompressor = new Decompressor();
		this.data;
		this.blocks = new Uint32Array(512*512*64);
	}

	getBlockIndex(x,y,z) {
		return (y*512*64)+(z*512)+x;
	}

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

	canBlockAction(x,y,z) {
		if (x < 0 || x > 511)
			return 0;

		if (y < 0 || x > 511)
			return 0;

		if (z < 0 || z > 63)
			return 0;

		return 1;
	}

	removeBlock(x,y,z) {
		if(!this.canBlockAction(x, y, z))
			return 0;

		let block_i = this.getBlockIndex(x, y, z);
		this.blocks[block_i] = 0;
		return 1;
	}

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