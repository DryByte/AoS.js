const BaseClient = require("./BaseClient.js");
const { mergeObj } = require("../utils.js");

const OrientationData = require("../packets/OrientationData.js");
const ExistingPlayer = require("../packets/ExistingPlayer.js");
const PositionData = require("../packets/PositionData.js");
const BlockAction = require("../packets/BlockAction.js");
const ChatMessage = require("../packets/ChatMessage.js");
const InputData = require("../packets/InputData.js");
const SetColor = require("../packets/SetColor.js");
const SetTool = require("../packets/SetTool.js");

const JOINOBJECT = {
	team: 0,
	weapon: 0,
	held_item: 0,
	kills: 0,
	block_red: 0,
	block_green: 0,
	block_blue: 0,
	name: "Deuce"
};

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

class Client extends BaseClient {
	constructor() {
		super();
	}

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
		ex_p.fields.name.value = send_obj.name;

		let send_packet = ex_p.encodeInfos();
		send_packet.writeUInt8(9, 0);

		this.sendPacket(send_packet);
	}

	sendMessage(msg, _type) {
		let msg_p = new ChatMessage();
		msg_p.fields.player_id.value = this.localPlayerId;
		msg_p.fields.chat_type.value = _type;
		msg_p.fields.chat_message.value = msg;

		let send_packet = msg_p.encodeInfos();
		send_packet.writeUInt8(17, 0);

		this.sendPacket(send_packet);
	}

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

	setTool(tool_id) {
		let stool_p = new SetTool();
		stool_p.fields.player_id.value = this.localPlayerId;
		stool_p.fields.tool.value = tool_id;

		let send_packet = stool_p.encodeInfos();
		send_packet.writeUInt8(7, 0);

		this.sendPacket(send_packet);
	}

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

	setPosition(x,y,z) {
		let pos_p = new PositionData();
		pos_p.fields.x.value = x;
		pos_p.fields.y.value = y;
		pos_p.fields.z.value = z;

		let send_packet = pos_p.encodeInfos();
		send_packet.writeUInt8(0, 0);

		this.sendPacket(send_packet);
	}
}

module.exports = Client;