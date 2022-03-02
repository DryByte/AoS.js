const BasePacket = require("./BasePacket.js");
const Player = require("../game/Player.js");
const { ByteType, UByteType, LEFloatType, StringType } = require("../types");

class CreatePlayer extends BasePacket {
	constructor(packet) {
		super()

		this.fields = {
			player_id:   new UByteType(),
			weapon:      new UByteType(),
			team:        new ByteType(),
			x:           new LEFloatType(),
			y:           new LEFloatType(),
			z:           new LEFloatType(),
			name:        new StringType(),
		}

		if (packet)
			this.parseInfos(packet);
	}

	organize(game) {
		let pId = this.fields.player_id.value;
		if (!game.players[pId])
			game.players[pId] = new Player();

		game.players[pId].playerId = pId;
		game.players[pId].weapon = this.fields.weapon.value;

		switch(this.fields.team.value){
			case -1:game.players[pId].team = game.spectatorTeam;break;
			case 0: game.players[pId].team = game.blueTeam;     break;
			case 1: game.players[pId].team = game.greenTeam;    break;
		}

		game.players[pId].position.x = this.fields.x.value;
		game.players[pId].position.y = this.fields.y.value;
		game.players[pId].position.z = this.fields.z.value;

		game.players[pId].name = this.fields.name.value;
	}
}

module.exports = CreatePlayer;