const BasePacket = require("./BasePacket.js");

class WorldUpdate extends BasePacket {
	constructor(packet) {
		super()

		this.fields = {};
		for (let i = 0; i < Math.floor(packet.length/(6*4)); i++) {
			this.fields[`player_${i}_pos_x`] = {type: "le float", value: 0};
			this.fields[`player_${i}_pos_y`] = {type: "le float", value: 0};
			this.fields[`player_${i}_pos_z`] = {type: "le float", value: 0};
			this.fields[`player_${i}_ori_x`] = {type: "le float", value: 0};
			this.fields[`player_${i}_ori_y`] = {type: "le float", value: 0};
			this.fields[`player_${i}_ori_z`] = {type: "le float", value: 0};
		}

		if (packet)
			this.parseInfos(packet);
	}

	organize(game) {
		let playerC = Math.floor(Object.keys(this.fields).length/(6*4));
		for (let i = 0; i < playerC; i++) {
			if (!game.players[i])
				continue;

			game.players[i].position.x = this.fields[`player_${i}_pos_x`].value;
			game.players[i].position.y = this.fields[`player_${i}_pos_y`].value;
			game.players[i].position.z = this.fields[`player_${i}_pos_z`].value;
			game.players[i].orientation.x = this.fields[`player_${i}_ori_x`].value;
			game.players[i].orientation.y = this.fields[`player_${i}_ori_y`].value;
			game.players[i].orientation.z = this.fields[`player_${i}_ori_z`].value;
		}
	}
}

module.exports = WorldUpdate;