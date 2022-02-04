const BasePacket = require("./BasePacket.js");
const Player = require("../game/Player.js");

class ExistingPlayer extends BasePacket {
	constructor(packet) {
		super()

		this.fields = {
			player_id:   {type: "ubyte", value: 0},
			team:        {type: "byte", value: 0},
			weapon:      {type: "ubyte", value: 0},
			held_item:   {type: "ubyte", value: 0},
			kills:       {type: "uint32", value: 0},
			block_blue:  {type: "ubyte", value: 0},
			block_green: {type: "ubyte", value: 0},
			block_red:   {type: "ubyte", value: 0},
			name:        {type: "string", value: ""},
		}

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