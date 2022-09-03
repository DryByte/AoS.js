const BaseClient = require("./BaseClient.js");
const { mergeObj } = require("../utils.js");

const OrientationData = require("../packets/OrientationData.js");
const ExistingPlayer = require("../packets/ExistingPlayer.js");
const PositionData = require("../packets/PositionData.js");
const WeaponReload = require("../packets/WeaponReload.js");
const WeaponInput = require("../packets/WeaponInput.js");
const BlockAction = require("../packets/BlockAction.js");
const ChatMessage = require("../packets/ChatMessage.js");
const InputData = require("../packets/InputData.js");
const SetColor = require("../packets/SetColor.js");
const SetTool = require("../packets/SetTool.js");
const Hit = require("../clientPackets/Hit.js");

/**
 * @typedef {object} JoinObject Object with options for JoinPacket
 * @property {number} [team] Id of the team to join
 * @property {number} [weapon] Id of the choosed weapon
 * @property {number} [held_item] Id of the item being hold
 * @property {number} [block_red] Red color amount for block color
 * @property {number} [block_green] Green color amount for block color
 * @property {number} [block_blue] Blue color amount for block color
 */
const JOINOBJECT = {
	team: 0,
	weapon: 0,
	held_item: 0,
	kills: 0,
	block_red: 0,
	block_green: 0,
	block_blue: 0
};

/**
 * @typedef {object} WalkInputs Object with booleans for Walking Inputs
 * @property {boolean} [up]
 * @property {boolean} [down]
 * @property {boolean} [left]
 * @property {boolean} [right]
 * @property {boolean} [jump]
 * @property {boolean} [crouch]
 * @property {boolean} [sneak]
 * @property {boolean} [sprint]
 */
const DEFAULTWALKINPUTS = {
	up: false,
	down: false,
	left: false,
	right: false,
	jump: false,
	crouch: false,
	sneak: false,
	sprint: false,
};

/**
 * Main Client class, containing high level functions to use. Use this to create your bot.
 * @extends {BaseClient}
 * @category Client
 */
class Client extends BaseClient {
	/**
	 * @constructor
	 * @param {ClientOptions} Options
	 */
	constructor(options) {
		super(options);
	}

	/**
	 * Join in a team, normally used after StateData packet.
	 * @param {JoinObject} JoinObject
	 */
	joinGame(obj={}) {
		let send_obj = mergeObj(JOINOBJECT, obj);

		let ex_p = new ExistingPlayer();
		ex_p.fields.player_id.value = this.localPlayerId;
		ex_p.fields.team.value = send_obj.team;
		ex_p.fields.weapon.value = send_obj.weapon;
		ex_p.fields.held_item.value = send_obj.held_item;
		ex_p.fields.kills.value = send_obj.kills;
		ex_p.fields.block_red.value = send_obj.block_red;
		ex_p.fields.block_green.value = send_obj.block_green;
		ex_p.fields.block_blue.value = send_obj.block_blue;
		ex_p.fields.name.value = this.options.name;

		let send_packet = ex_p.encodeInfos();
		send_packet.writeUInt8(9, 0);

		this.sendPacket(send_packet);
	}

	/**
	 * Send a message in the chat.
	 * @param {string} Message String representing the message text
	 * @param {number} ChatType Chat type ID
	 */
	sendMessage(msg, _type) {
		let msg_p = new ChatMessage();
		msg_p.fields.player_id.value = this.localPlayerId;
		msg_p.fields.chat_type.value = _type;
		msg_p.fields.chat_message.value = msg;

		let send_packet = msg_p.encodeInfos();
		send_packet.writeUInt8(17, 0);

		this.sendPacket(send_packet);
	}

	/**
	 * Send multiple messages a once with a delay between them.
	 * @param {array} Messages String array with the messages to be sent.
	 * @param {number} ChatType Chat Type ID
	 * @param {number} Delay Delay in ms between each message.
	 */
	sendLines(msg_array, _type, delay) {
		for (let msg_i in msg_array) {
			setTimeout(() => {
				let content = msg_array[msg_i];
				this.sendMessage(content, _type);
			}, delay*msg_i);
		}
	}

	/**
	 * Look at a specific coordinate.
	 * @param {number}
	 * @param {number}
	 * @param {number}
	 */
	lookAt(x,y,z) {
		let bot_pos = this.game.players[this.localPlayerId].position;
		x-=bot_pos.x;
		y-=bot_pos.y;
		z-=bot_pos.z;

		let mag = Math.sqrt(x*x+y*y+z*z);

		let ori_p = new OrientationData();
		ori_p.fields.x.value = x/mag;
		ori_p.fields.y.value = y/mag;
		ori_p.fields.z.value = z/mag;

		let send_packet = ori_p.encodeInfos();
		send_packet.writeUInt8(1, 0);

		this.sendPacket(send_packet);
	}

	/**
	 * Set block color.
	 * @param {number} Red Red color amount
	 * @param {number} Green Green color amount
	 * @param {number} Blue Blue color amount
	 */
	setColor(r,g,b) {
		let scolor_p = new SetColor();
		scolor_p.fields.player_id.value = this.localPlayerId;
		scolor_p.fields.red.value   = r;
		scolor_p.fields.green.value = g;
		scolor_p.fields.blue.value  = b;

		let send_packet = scolor_p.encodeInfos();
		send_packet.writeUInt8(8, 0);

		this.sendPacket(send_packet);
	}

	/**
	 * Set tool to hold.
	 * @param {number} ToolId Tool Id
	 */
	setTool(tool_id) {
		let stool_p = new SetTool();
		stool_p.fields.player_id.value = this.localPlayerId;
		stool_p.fields.tool.value = tool_id;

		let send_packet = stool_p.encodeInfos();
		send_packet.writeUInt8(7, 0);

		this.sendPacket(send_packet);
	}

	/**
	 * Try to place a block in a specific coordinate.
	 * @param {number} X X Coordinate
	 * @param {number} Y Y Coordinate
	 * @param {number} Z Z Coordinate
	 */
	placeBlock(x,y,z) {
		let block_p = new BlockAction();
		block_p.fields.player_id.value   = this.localPlayerId;
		block_p.fields.action_type.value = 0;
		block_p.fields.x.value = x;
		block_p.fields.y.value = y;
		block_p.fields.z.value = z;

		let send_packet = block_p.encodeInfos();
		send_packet.writeUInt8(13, 0);

		this.sendPacket(send_packet);
	}

	/**
	 * Set Client's inputs.
	 * @param {WalkInputs} WalkInputs
	 */
	setWalkInputs(wk_obj) {
		if(!wk_obj) {
			wk_obj = DEFAULTWALKINPUTS;
		} else {
			wk_obj = mergeObj(DEFAULTWALKINPUTS, wk_obj);
		}

		let input_p = new InputData();
		input_p.fields.player_id.value = this.localPlayerId;
		input_p.setKeyStates(wk_obj);

		let send_packet = input_p.encodeInfos();
		send_packet.writeUInt8(3, 0);

		this.sendPacket(send_packet);
	}

	/**
	 * Set Client's position.
	 * @param {number} X X Coordinate
	 * @param {number} Y Y Coordinate
	 * @param {number} Z Z Coordinate
	 */
	setPosition(x,y,z) {
		let pos_p = new PositionData();
		pos_p.fields.x.value = x;
		pos_p.fields.y.value = y;
		pos_p.fields.z.value = z;

		let send_packet = pos_p.encodeInfos();
		send_packet.writeUInt8(0, 0);

		this.sendPacket(send_packet);
	}

	/**
	 * Send a reload packet with custom clip ammo and reserve ammo.
	 * @param {number} Clip AMMO in the Clip
	 * @param {number} Reserver AMMO in the Reserve
	 */
	sendCustomReload(clip_ammo, reserve_ammo) {
		let weapr = new WeaponReload();
		weapr.fields.player_id.value = this.localPlayerId;
		weapr.fields.clip.value = clip_ammo;
		weapr.fields.reserve.value = reserve_ammo;

		let send_packet = weapr.encodeInfos();
		send_packet.writeUInt8(28, 0);

		this.sendPacket(send_packet);
	}

	/**
	 * Toggle/untoggle weapon firing.
	 * @returns {boolean}
	 */
	toggleFiring() {
		let localPlayer = this.game.players[this.localPlayerId];

		let weain = new WeaponInput();
		weain.fields.player_id.value = this.localPlayerId;
		weain.setWeaponInput(!localPlayer.firing, 0);

		weain.organize(this.game);

		let send_packet = weain.encodeInfos();
		send_packet.writeUInt8(4, 0);

		this.sendPacket(send_packet);

		return localPlayer.firing;
	}

	/**
	 * Send an Hit packet to the server.
	 * @param {number} PlayerId The player's ID to get hitted.
	 * @param {number} HitType Hit type.
	 */
	hitPlayer(player_id, hit_type) {
		let hitp = new Hit();
		hitp.fields.player_id.value = player_id;
		hitp.fields.hit_type.value = hit_type;

		let send_packet = hitp.encodeInfos();
		send_packet.writeUInt8(5, 0);

		this.sendPacket(send_packet);
	}

	/**
	 * Disconnect the client from the server.
	 */
	disconnect() {
		this.peer.disconnectLater();
	}
}

module.exports = Client;