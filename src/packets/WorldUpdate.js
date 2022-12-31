const BasePacket = require("./BasePacket.js");
const { LEFloatType } = require("../types");

class WorldUpdate extends BasePacket {
	constructor(packet) {
		super();

		this.id = 2;
		this.fields = {};
		for (let i = 0; i < Math.floor(packet.length/(6*4)); i++) {
			this.fields[`player_${i}_pos_x`] = new LEFloatType();
			this.fields[`player_${i}_pos_y`] = new LEFloatType();
			this.fields[`player_${i}_pos_z`] = new LEFloatType();
			this.fields[`player_${i}_ori_x`] = new LEFloatType();
			this.fields[`player_${i}_ori_y`] = new LEFloatType();
			this.fields[`player_${i}_ori_z`] = new LEFloatType();
		}

		if (packet)
			this.parseInfos(packet);
	}

	organize(game) {
		let playerC = Math.floor(Object.keys(this.fields).length/6);
		for (let i = 0; i < playerC; i++) {
			if (!game.players[i])
				continue;

			game.players[i].position.x = this.getValue(`player_${i}_pos_x`);
			game.players[i].position.y = this.getValue(`player_${i}_pos_y`);
			game.players[i].position.z = this.getValue(`player_${i}_pos_z`);
			game.players[i].orientation.x = this.getValue(`player_${i}_ori_x`);
			game.players[i].orientation.y = this.getValue(`player_${i}_ori_y`);
			game.players[i].orientation.z = this.getValue(`player_${i}_ori_z`);
		}
	}
}

module.exports = WorldUpdate;