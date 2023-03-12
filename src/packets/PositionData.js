const BasePacket = require("./BasePacket.js");
const { LEFloatType } = require("../types");

/**
 * @category Packets
 * @extends {BasePacket}
 */
class PositionData extends BasePacket {
	constructor(packet) {
		super();

		/**
		 * Packet Id
		 * @type Integer
		 */
		this.id = 0;

		/**
		 * Fields Object
		 * @property {LEFloatType} x X coordinate
		 * @property {LEFloatType} y Y coordinate
		 * @property {LEFloatType} z Z coordinate
		 */
		this.fields = {
			x: new LEFloatType(),
			y: new LEFloatType(),
			z: new LEFloatType()
		};

		if (packet)
			this.parseInfos(packet);
	}

	organize(game) {
		game.players[game.local.localPlayerId].position = {
			x: this.getValue("x"),
			y: this.getValue("y"),
			z: this.getValue("z")
		};
	}
}

module.exports = PositionData;