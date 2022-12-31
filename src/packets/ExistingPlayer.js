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
		let pId = this.getValue("player_id");
		if (!game.players[pId])
			game.players[pId] = new Player();

		game.players[pId].playerId = pId;

		switch(this.getValue("team")){
		case -1:game.players[pId].team = game.spectatorTeam;break;
		case 0: game.players[pId].team = game.blueTeam;     break;
		case 1: game.players[pId].team = game.greenTeam;    break;
		}

		game.players[pId].weapon = this.getValue("weapon");
		game.players[pId].tool = this.getValue("held_item");
		game.players[pId].kills = this.getValue("kills");

		game.players[pId].blockColor[0] = this.getValue("block_red");
		game.players[pId].blockColor[1] = this.getValue("block_green");
		game.players[pId].blockColor[2] = this.getValue("block_blue");

		game.players[pId].name = this.getValue("name");
	}
}

module.exports = ExistingPlayer;