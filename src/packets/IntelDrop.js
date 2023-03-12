const BasePacket = require("./BasePacket.js");
const { UByteType, LEFloatType } = require("../types");

/**
 * @category Packets
 * @extends {BasePacket}
 */
class IntelDrop extends BasePacket {
	constructor(packet) {
		super();

		/**
		 * Packet Id
		 * @type Integer
		 */
		this.id = 25;

		/**
		 * Fields Object
		 * @property {UByteType} player_id Player's id
		 * @property {LEFloatType} x Drop X coordinate
		 * @property {LEFloatType} y Drop Y coordinate
		 * @property {LEFloatType} z Drop Z coordinate
		 */
		this.fields = {
			player_id: new UByteType(),
			x:         new LEFloatType(),
			y:         new LEFloatType(),
			z:         new LEFloatType(),
		};

		if (packet)
			this.parseInfos(packet);
	}

	organize(game) {
		let player = game.players[this.getValue("player_id")];
		if (!player)
			return;

		let x = this.getValue("x"),
			y = this.getValue("y"),
			z = this.getValue("z");

		player.team.hasIntel = null;

		if(player.team.id == 0) {
			game.greenTeam.intel = [x,y,z];
		} else if (player.team.id == 1) {
			game.blueTeam.intel = [x,y,z];
		}
	}
}

module.exports = IntelDrop;