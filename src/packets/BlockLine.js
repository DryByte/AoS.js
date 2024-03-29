const BasePacket = require("./BasePacket.js");
const { UByteType, LEIntType } = require("../types");

/**
 * @category Packets
 * @extends {BasePacket}
 */
class BlockLine extends BasePacket {
	constructor(packet) {
		super();

		/**
		 * Packet Id
		 * @type Integer
		 */
		this.id = 14;

		/**
		 * Fields Object
		 * @property {UByteType} player_id Player's id
		 * @property {LEIntType} x1 X Start point of the line
		 * @property {LEIntType} y1 Y Start point of the line
		 * @property {LEIntType} z1 Z Start point of the line
		 * @property {LEIntType} x2 X End point of the line
		 * @property {LEIntType} y2 Y End point of the line
		 * @property {LEIntType} z2 Z End point of the line
		 */
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
		let pId = this.getValue("player_id");

		if (pId > 31)
			pId = 32;

		if (!game.players[pId])
			return;

		let pos1 = {
			x: this.getValue("x1"),
			y: this.getValue("y1"),
			z: this.getValue("z1")
		};

		let pos2 = {
			x: this.getValue("x2"),
			y: this.getValue("y2"),
			z: this.getValue("z2")
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