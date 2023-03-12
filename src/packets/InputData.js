const BasePacket = require("./BasePacket.js");
const { UByteType } = require("../types");

/**
 * @category Packets
 * @extends {BasePacket}
 */
class InputData extends BasePacket {
	constructor(packet) {
		super();

		/**
		 * Packet Id
		 * @type Integer
		 */
		this.id = 3;

		/**
		 * Fields Object
		 * @property {UByteType} player_id Player's id
		 * @property {UByteType} key_states A byte that each bit is a key state
		 */
		this.fields = {
			player_id: new UByteType(),
			key_states: new UByteType()
		};

		if (packet)
			this.parseInfos(packet);
	}

	organize(game) {
		game.players[this.getValue("player_id")].inputs = this.getKeyStates();
	}

	/**
	 * Set key states field using object
	 * @param {WalkInputs} KeyStates Object with key states.
	 */
	setKeyStates(state_obj) {
		let bits = 0;
		let current_state = 0;

		for (let v in state_obj) {
			bits |= state_obj[v] << current_state;
			current_state+=1;
		}

		this.fields.key_states.value = bits;
	}

	/**
	 * Get the an object with the key_states fields
	 * @returns {WalkInputs}
	 */
	getKeyStates() {
		let r_obj = {up: false, down: false, left: false, right: false, jump: false, crouch: false, sneak: false, sprint: false};
		let current_state = 0;

		for (let v in r_obj) {
			r_obj[v] = (this.getValue("key_states") >> current_state) & 1;
			current_state+=1;
		}

		return r_obj;
	}
}

module.exports = InputData;