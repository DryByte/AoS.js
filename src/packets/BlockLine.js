const BasePacket = require("./BasePacket.js");
const { UByteType, LEIntType } = require("../types");

class BlockLine extends BasePacket {
	constructor(packet) {
		super();

		this.id = 14;
		this.fields = {
			player_id:        new UByteType(),
			x1:               new LEIntType(),
			y1:               new LEIntType(),
			z1:               new LEIntType(),
			x2:               new LEIntType(),
			y2:               new LEIntType(),
			z2:               new LEIntType(),
		};

		if (packet)
			this.parseInfos(packet);
	}

	organize(game) {
		let pId = this.fields.player_id.value;

		if (pId > 31)
			pId = 32;

		if (!game.players[pId])
			return;

		let pos1 = {
			x: this.fields.x1.value,
			y: this.fields.y1.value,
			z: this.fields.z1.value
		};

		let pos2 = {
			x: this.fields.x2.value,
			y: this.fields.y2.value,
			z: this.fields.z2.value
		};

		let color = game.players[pId].blockColor;
		let len = game.map.addBlockLine(pos1, pos2, {
			r: color[0], g: color[1], b: color[2]
		});

		if (len)
			game.players[pId].blocks -= game.players[pId].blocks<=0 ? 0 : len;
	}
}

module.exports = BlockLine;