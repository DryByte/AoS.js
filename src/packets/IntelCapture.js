const BasePacket = require("./BasePacket.js");
const { UByteType } = require("../types");

/**
 * @category Packets
 * @extends {BasePacket}
 */
class IntelCapture extends BasePacket {
	constructor(packet) {
		super();

		/**
		 * Packet Id
		 * @type Integer
		 */
		this.id = 23;

		/**
		 * Fields Object
		 * @property {UByteType} player_id Player's id
		 * @property {UByteType} winning Boolean if thats the winning intel
		 */
		this.fields = {
			player_id:    new UByteType(),
			winning:      new UByteType(),
		};

		if (packet)
			this.parseInfos(packet);
	}

	organize(game) {
		let player = game.players[this.getValue("player_id")];
		if (!player)
			return;

		// Hard coded value in all clients
		player.kills += 10;
		player.team.score += 1;

		if (this.getValue("winning")) {
			game.local.emit("WinCapture", this.fields);
		}
	}
}

module.exports = IntelCapture;