const BasePacket = require("./BasePacket.js");
const { LEFloatType } = require("../types");

/**
 * @category Packets
 * @extends {BasePacket}
 */
class OrientationData extends BasePacket {
	constructor(packet) {
		super();

		/**
		 * Packet Id
		 * @type Integer
		 */
		this.id = 1;

		/**
		 * Fields Object
		 * @property {LEFloatType} x Orientation X
		 * @property {LEFloatType} y Orientation Y
		 * @property {LEFloatType} z Orientation Z
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
		game.players[game.local.localPlayerId].orientation = {
			x: this.getValue("x"),
			y: this.getValue("y"),
			z: this.getValue("z")
		};
	}
}

module.exports = OrientationData;