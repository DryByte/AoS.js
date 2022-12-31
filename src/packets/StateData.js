const BasePacket = require("./BasePacket.js");
const { mergeObj } = require("../utils.js");
const { UByteType, StringType, LEFloatType } = require("../types");
const Player = require("../game/Player.js");

class StateData extends BasePacket {
	constructor(packet) {
		super();

		this.id = 15;
		this.fields = {
			player_id:    new UByteType(),

			fog_blue:     new UByteType(),
			fog_green:    new UByteType(),
			fog_red:      new UByteType(),

			team_1_blue:  new UByteType(),
			team_1_green: new UByteType(),
			team_1_red:   new UByteType(),
			team_2_blue:  new UByteType(),
			team_2_green: new UByteType(),
			team_2_red:   new UByteType(),

			team_1_name:  new StringType(10),
			team_2_name:  new StringType(10),

			gamemode_id:  new UByteType()
		};

		// I know this is ugly, but cant figure out other ways...
		let gamemode_id = packet.readUInt8(31);
		if (gamemode_id == 0) {
			let ctfObj = {
				team_1_score: new UByteType(),
				team_2_score: new UByteType(),

				capture_limit: new UByteType(),
				intel_signals: new UByteType(),
			};
			let signal = packet.readUInt8(35); // after skips

			let team_1_holding = signal&1;
			let team_2_holding = (signal>>1)&1;

			if (team_2_holding) {
				ctfObj.team_1_intel_holding = new UByteType(11);
			} else {
				ctfObj.team_1_intel_x = new LEFloatType();
				ctfObj.team_1_intel_y = new LEFloatType();
				ctfObj.team_1_intel_z = new LEFloatType();
			}

			if (team_1_holding) {
				ctfObj.team_2_intel_holding = new UByteType(11);
			} else {
				ctfObj.team_2_intel_x = new LEFloatType();
				ctfObj.team_2_intel_y = new LEFloatType();
				ctfObj.team_2_intel_z = new LEFloatType();
			}

			ctfObj.team_1_base_x = new LEFloatType();
			ctfObj.team_1_base_y = new LEFloatType();
			ctfObj.team_1_base_z = new LEFloatType();

			ctfObj.team_2_base_x = new LEFloatType();
			ctfObj.team_2_base_y = new LEFloatType();
			ctfObj.team_2_base_z = new LEFloatType();

			this.fields = mergeObj(this.fields, ctfObj);
		} else if(gamemode_id == 1) {
			let tcObj = {
				territory_count: new UByteType()
			};

			let count = packet.readUInt8(32);
			for (let i = 0; i < count; i++) {
				tcObj[`cp_${i}_x`] = new LEFloatType();
				tcObj[`cp_${i}_y`] = new LEFloatType();
				tcObj[`cp_${i}_z`] = new LEFloatType();
				tcObj[`cp_${i}_state`] = new UByteType();
			}

			this.fields = mergeObj(this.fields, tcObj);
		}

		if (packet)
			this.parseInfos(packet);
	}

	organize(game) {
		game.local.localPlayerId = this.getValue("player_id");
		game.players[game.local.localPlayerId] = new Player();

		game.fog[2] = this.getValue("fog_blue");
		game.fog[1] = this.getValue("fog_green");
		game.fog[0] = this.getValue("fog_red");

		game.blueTeam.color[2] = this.getValue("team_1_blue");
		game.blueTeam.color[1] = this.getValue("team_1_green");
		game.blueTeam.color[0] = this.getValue("team_1_red");

		game.greenTeam.color[2] = this.getValue("team_2_blue");
		game.greenTeam.color[1] = this.getValue("team_2_green");
		game.greenTeam.color[0] = this.getValue("team_2_red");

		game.blueTeam.name  = this.getValue("team_1_name");
		game.greenTeam.name = this.getValue("team_2_name");

		game.gamemode = this.getValue("gamemode_id");

		if (game.gamemode == 0) {
			game.capture_limit = this.getValue("capture_limit");
			game.blueTeam.score = this.getValue("team_1_score");
			game.greenTeam.score = this.getValue("team_2_score");

			if (!this.fields.team_1_intel_holding) {
				game.blueTeam.intel[0] = this.getValue("team_1_intel_x");
				game.blueTeam.intel[1] = this.getValue("team_1_intel_y");
				game.blueTeam.intel[2] = this.getValue("team_1_intel_z");
			} else {
				game.blueTeam.intel = [new LEFloatType(),new LEFloatType(),new LEFloatType()];
			}

			if (!this.fields.team_2_intel_holding) {
				game.greenTeam.intel[0] = this.getValue("team_2_intel_x");
				game.greenTeam.intel[1] = this.getValue("team_2_intel_y");
				game.greenTeam.intel[2] = this.getValue("team_2_intel_z");
			} else {
				game.greenTeam.intel = [new LEFloatType(),new LEFloatType(),new LEFloatType()];
			}

			game.blueTeam.base[0] = this.getValue("team_1_base_x");
			game.blueTeam.base[1] = this.getValue("team_1_base_y");
			game.blueTeam.base[2] = this.getValue("team_1_base_z");

			game.greenTeam.base[0] = this.getValue("team_2_base_x");
			game.greenTeam.base[1] = this.getValue("team_2_base_y");
			game.greenTeam.base[2] = this.getValue("team_2_base_z");
		} else if (game.gamemode == 1) {
			let count = this.getValue("territory_count");

			if (!game.cps || game.cps.length != count)
				game.cps = new Array(count);

			for (let i = 0; i < count; i++) {
				game.cps[i] = {
					x: this.getValue(`cp_${i}_x`),
					y: this.getValue(`cp_${i}_y`),
					z: this.getValue(`cp_${i}_z`),
					state: this.getValue(`cp_${i}_state`),
				};
			}
		}

		game.map.data = game.map.decompressor.exec();
		game.map.loadVXL();
	}
}

module.exports = StateData;