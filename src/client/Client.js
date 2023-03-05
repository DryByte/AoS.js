const BaseClient = require("./BaseClient.js");
const { mergeObj } = require("../utils.js");

const OrientationData = require("../packets/OrientationData.js");
const ExistingPlayer = require("../packets/ExistingPlayer.js");
const PositionData = require("../packets/PositionData.js");
const WeaponReload = require("../packets/WeaponReload.js");
const ChangeWeapon = require("../packets/ChangeWeapon.js");
const WeaponInput = require("../packets/WeaponInput.js");
const BlockAction = require("../packets/BlockAction.js");
const ChatMessage = require("../packets/ChatMessage.js");
const ChangeTeam = require("../packets/ChangeTeam.js");
const InputData = require("../packets/InputData.js");
const SetColor = require("../packets/SetColor.js");
const SetTool = require("../packets/SetTool.js");
const Hit = require("../clientPackets/Hit.js");

const VersionHandshakeRes = require("../extraPackets/VersionHandshakeRes.js");
const VersionSend = require("../extraPackets/VersionSend.js");

const { version } = require("../../package.json");

/**
 * @typedef {object} VersionInfoObject Object with options for Version packet
 * @property {string} [identifier] A identifier for the client in game
 * @property {array} [version] Version array [Major, Minor, Revision]
 * @property {string} [os_info] Informations about the current OS or whatever
 */
const VERSIONINFOOBJECT = {
	client_identifier: "js",
	version: version.split("."),
	os_info: `Node.js: ${process.version}`
};

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
		ex_p.setValue("player_id", this.localPlayerId);
		ex_p.setValue("team", send_obj.team);
		ex_p.setValue("weapon", send_obj.weapon);
		ex_p.setValue("held_item", send_obj.held_item);
		ex_p.setValue("kills", send_obj.kills);
		ex_p.setValue("block_red", send_obj.block_red);
		ex_p.setValue("block_green", send_obj.block_green);
		ex_p.setValue("block_blue", send_obj.block_blue);
		ex_p.setValue("name", this.options.name);

		let send_packet = ex_p.encodeInfos();
		this.sendPacket(send_packet);
	}

	/**
	 * Send a message in the chat.
	 * @param {string} Message String representing the message text
	 * @param {number} ChatType Chat type ID
	 */
	sendMessage(msg, _type) {
		let msg_p = new ChatMessage();
		msg_p.setValue("player_id", this.localPlayerId);
		msg_p.setValue("chat_type", _type);
		msg_p.setValue("chat_message", msg + '\x00');

		let send_packet = msg_p.encodeInfos();
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
		if (!mag)
			mag = 1;

		let ori_p = new OrientationData();
		ori_p.setValue("x", x/mag);
		ori_p.setValue("y", y/mag);
		ori_p.setValue("z", z/mag);

		let send_packet = ori_p.encodeInfos();
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
		scolor_p.setValue("player_id", this.localPlayerId);
		scolor_p.setValue("red", r);
		scolor_p.setValue("green", g);
		scolor_p.setValue("blue", b);

		let send_packet = scolor_p.encodeInfos();
		this.sendPacket(send_packet);
	}

	/**
	 * Set tool to hold.
	 * @param {number} ToolId Tool Id
	 */
	setTool(tool_id) {
		let stool_p = new SetTool();
		stool_p.setValue("player_id", this.localPlayerId);
		stool_p.setValue("tool", tool_id);

		let send_packet = stool_p.encodeInfos();
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
		block_p.setValue("player_id", this.localPlayerId);
		block_p.setValue("action_type", 0);
		block_p.setValue("x", x);
		block_p.setValue("y", y);
		block_p.setValue("z", z);

		let send_packet = block_p.encodeInfos();
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
		input_p.setValue("player_id", this.localPlayerId);
		input_p.setKeyStates(wk_obj);

		let send_packet = input_p.encodeInfos();
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
		pos_p.setValue("x", x);
		pos_p.setValue("y", y);
		pos_p.setValue("z", z);

		let send_packet = pos_p.encodeInfos();
		this.sendPacket(send_packet);
	}

	/**
	 * Send a reload packet with custom clip ammo and reserve ammo.
	 * @param {number} Clip AMMO in the Clip
	 * @param {number} Reserver AMMO in the Reserve
	 */
	sendCustomReload(clip_ammo, reserve_ammo) {
		let weapr = new WeaponReload();
		weapr.setValue("player_id", this.localPlayerId);
		weapr.setValue("clip", clip_ammo);
		weapr.setValue("reserve", reserve_ammo);

		let send_packet = weapr.encodeInfos();
		this.sendPacket(send_packet);
	}

	/**
	 * Toggle/untoggle weapon firing.
	 * @returns {boolean}
	 */
	toggleFiring() {
		let localPlayer = this.game.players[this.localPlayerId];

		let weain = new WeaponInput();
		weain.setValue("player_id", this.localPlayerId);
		weain.setWeaponInput(!localPlayer.firing, 0);

		weain.organize(this.game);

		let send_packet = weain.encodeInfos();
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
		hitp.setValue("player_id", player_id);
		hitp.setValue("hit_type", hit_type);

		let send_packet = hitp.encodeInfos();
		this.sendPacket(send_packet);
	}

	/**
	 * Disconnect the client from the server.
	 */
	disconnect() {
		this.peer.disconnectLater();
	}

	/**
	 * Ask server to change team, server will send CreatePlayer with the new team.
	 * @param {number} TeamId Team ID to change.
	 */
	changeTeam(team_id) {
		let teamp = new ChangeTeam();
		teamp.setValue("player_id", this.localPlayerId);
		teamp.setValue("team_id", team_id);

		let send_packet = teamp.encodeInfos();
		this.sendPacket(send_packet);
	}

	/**
	 * Ask server to change weapon
	 * @param {number} WeaponId Weapon ID to change.
	 */
	changeWeapon(weapon_id){
		let weaponp = new ChangeWeapon();
		weaponp.setValue("player_id", this.localPlayerId);
		weaponp.setValue("weapon_id", weapon_id);

		let send_packet = weaponp.encodeInfos();
		this.sendPacket(send_packet);
	}

	/**
	 * Get all players connected to the server 
	 */
	getOnlinePlayers() {
		let players = [];
		for (let player of this.game.players) {
			if (!player)
				continue;

			players.push(player);
		}

		return players;
	}

	/**
	 * Response to an handshake sent by the server
	 * @param {number} Challenge The Challenge int sent by the server on VersionHandshakeInit
	 */
	sendVersionHandshake(challenge) {
		let vhResponse = new VersionHandshakeRes();
		vhResponse.setValue("challenge", challenge);

		let packet = vhResponse.encodeInfos();
		this.sendPacket(packet);
	}

	/**
	 * Set the version informations for the server.
	 * @param {VersionInfoObject} [VersionObject] Object with the version informations.
	 */
	setVersionInfo(infosObj) {
		let infos = mergeObj(this.options.version_info, infosObj);
		if (!this.options.version_info.client_identifier)
			infos = mergeObj(VERSIONINFOOBJECT, infosObj);

		this.options.version_info = infos;
	}

	/**
	 * Send to the server your client and version infos, remember to set version using setVersionInfo() before this.
	 */
	sendVersion() {
		if (!this.options.version_info.client_identifier)
			return;

		let infos = this.options.version_info;
		let vsPacket = new VersionSend();
		vsPacket.setValue("client_identifier", infos.client_identifier.charCodeAt(0));
		vsPacket.setValue("version_major", infos.version[0]);
		vsPacket.setValue("version_minor", infos.version[1]);
		vsPacket.setValue("version_revision", infos.version[2]);
		vsPacket.setValue("os", infos.os_info);

		let packet = vsPacket.encodeInfos();
		this.sendPacket(packet);
	}
}

module.exports = Client;
