const BasePacket = require("./BasePacket.js");
const { mergeObj } = require("../utils.js");
const { UByteType, StringType, LEFloatType } = require("../types");

class StateData extends BasePacket {
	constructor(packet) {
		super()

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
		}

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
			}

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
		game.local.playerId = this.fields.player_id.value;

		game.fog[2] = this.fields.fog_blue.value;
		game.fog[1] = this.fields.fog_green.value;
		game.fog[0] = this.fields.fog_red.value;

		game.blueTeam.color[2] = this.fields.team_1_blue.value;
		game.blueTeam.color[1] = this.fields.team_1_green.value;
		game.blueTeam.color[0] = this.fields.team_1_red.value;

		game.greenTeam.color[2] = this.fields.team_2_blue.value;
		game.greenTeam.color[1] = this.fields.team_2_green.value;
		game.greenTeam.color[0] = this.fields.team_2_red.value;

		game.blueTeam.name = this.fields.team_1_name.value;
		game.greenTeam.name = this.fields.team_2_name.value;

		game.gamemode = this.fields.gamemode_id.value;

		if (game.gamemode == 0) {
			game.capture_limit = this.fields.capture_limit.value;
			game.blueTeam.score = this.fields.team_1_score.value;
			game.greenTeam.score = this.fields.team_2_score.value;

			game.blueTeam.intel[0] = this.fields.team_1_intel_x.value;
			game.blueTeam.intel[1] = this.fields.team_1_intel_y.value;
			game.blueTeam.intel[2] = this.fields.team_1_intel_z.value;

			game.greenTeam.intel[0] = this.fields.team_2_intel_x.value;
			game.greenTeam.intel[1] = this.fields.team_2_intel_y.value;
			game.greenTeam.intel[2] = this.fields.team_2_intel_z.value;

			game.blueTeam.base[0] = this.fields.team_1_base_x.value;
			game.blueTeam.base[1] = this.fields.team_1_base_y.value;
			game.blueTeam.base[2] = this.fields.team_1_base_z.value;

			game.greenTeam.base[0] = this.fields.team_2_base_x.value;
			game.greenTeam.base[1] = this.fields.team_2_base_y.value;
			game.greenTeam.base[2] = this.fields.team_2_base_z.value;			
		} else if (game.gamemode == 1) {
			let count = this.fields.territory_count.value;

			if (!game.cps || game.cps.length != count)
				game.cps = new Array(count);

			for (let i = 0; i < count; i++) {
				game.cps[i] = {
					x: this.fields[`cp_${i}_x`].value,
					y: this.fields[`cp_${i}_y`].value,
					z: this.fields[`cp_${i}_z`].value,
					state: this.fields[`cp_${i}_state`].value,
				}
			}
		}

		game.map.data = game.map.decompressor.exec();
		game.map.loadVXL();
	}
}

module.exports = StateData;