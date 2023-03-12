const BasePacket = require("./BasePacket.js");
const { UByteType } = require("../types");

/**
 * @category Packets
 * @extends {BasePacket}
 */
class KillAction extends BasePacket {
	constructor(packet) {
		super();

		/**
		 * Packet Id
		 * @type Integer
		 */
		this.id = 16;

		/**
		 * Fields Object
		 * @property {UByteType} player_id Player's id
		 * @property {UByteType} killer_id Killer player's id
		 * @property {UByteType} kill_type Kill type
		 * @property {UByteType} respawn_time Time until respawn
		 */
		this.fields = {
			player_id:      new UByteType(),
			killer_id:      new UByteType(),
			kill_type:      new UByteType(),
			respawn_time:   new UByteType(),
		};

		if (packet)
			this.parseInfos(packet);
	}

	organize(game) {
		let player = game.players[this.getValue("player_id")];
		if (!player)
			return;

		player.dead = true;

		let killer = game.players[this.getValue("killer_id")];
		if (!killer)
			return;

		killer.kills += 1;
	}
}

module.exports = KillAction;