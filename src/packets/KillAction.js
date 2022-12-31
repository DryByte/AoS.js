const BasePacket = require("./BasePacket.js");
const { UByteType } = require("../types");

class KillAction extends BasePacket {
	constructor(packet) {
		super();

		this.id = 16;
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