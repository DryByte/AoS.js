const BasePacket = require("./BasePacket.js");
const Player = require("../game/Player.js");
const { ByteType, UByteType, StringType, UInt32Type } = require("../types");

class ExistingPlayer extends BasePacket {
	constructor(packet) {
		super();

		this.id = 9;
		this.fields = {
			player_id:   new UByteType(),
			team:        new ByteType(),
			weapon:      new UByteType(),
			held_item:   new UByteType(),
			kills:       new UInt32Type(),
			block_blue:  new UByteType(),
			block_green: new UByteType(),
			block_red:   new UByteType(),
			name:        new StringType(),
		};

		if (packet)
			this.parseInfos(packet);
	}

	organize(game) {
		let pId = this.fields.player_id.value;
		if (!game.players[pId])
			game.players[pId] = new Player();

		game.players[pId].playerId = pId;

		switch(this.fields.team.value){
		case -1:game.players[pId].team = game.spectatorTeam;break;
		case 0: game.players[pId].team = game.blueTeam;     break;
		case 1: game.players[pId].team = game.greenTeam;    break;
		}

		game.players[pId].weapon = this.fields.weapon.value;
		game.players[pId].tool = this.fields.held_item.value;
		game.players[pId].kills = this.fields.kills.value;

		game.players[pId].blockColor[0] = this.fields.block_red.value;
		game.players[pId].blockColor[1] = this.fields.block_green.value;
		game.players[pId].blockColor[2] = this.fields.block_blue.value;

		game.players[pId].name = this.fields.name.value;
	}
}

module.exports = ExistingPlayer;