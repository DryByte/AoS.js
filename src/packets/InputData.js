const BasePacket = require("./BasePacket.js");
const { UByteType } = require("../types");

class InputData extends BasePacket {
	constructor(packet) {
		super();

		this.id = 3;
		this.fields = {
			player_id: new UByteType(),
			key_states: new UByteType()
		};

		if (packet)
			this.parseInfos(packet);
	}

	organize(game) {
		game.players[this.fields.player_id.value].inputs = this.getKeyStates();
	}

	setKeyStates(state_obj) {
		let bits = 0;
		let current_state = 0;

		for (let v in state_obj) {
			bits |= state_obj[v] << current_state;
			current_state+=1;
		}

		this.fields.key_states.value = bits;
	}

	getKeyStates() {
		let r_obj = {up: false, down: false, left: false, right: false, jump: false, crouch: false, sneak: false, sprint: false};
		let current_state = 0;

		for (let v in r_obj) {
			r_obj[v] = (this.fields.key_states.value >> current_state) & 1;
			current_state+=1;
		}

		return r_obj;
	}
}

module.exports = InputData;