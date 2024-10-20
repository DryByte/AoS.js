const enet = require("enet");
const EventEmitter = require("events");

const Game = require("../game/Game.js");
const Player = require("../game/Player.js");
const { parseURI, mergeObj } = require("../utils.js");
const PACKETS = require("../packets/EPacketHandler.js");
const EXTRAPACKETS = require("../extraPackets");

// we will need to move this to a different file...
/**
 * @typedef {object} ClientOptions
 * @property {string} [name] Bot's name
 */
const defaultOptions = {
	name: "Deuce",
	version_info: {}
};

/**
 * @extends {EventEmitter}
 * @category Client
 */
class BaseClient extends EventEmitter {
	constructor(options) {
		super();

		let defOpt = defaultOptions;
		if (options)
			defOpt = mergeObj(defaultOptions, options);

		this.options = defOpt;

		this.game = new Game(this);
		this.localPlayerId;
		this.client;
		this.peer;
	}

	get name() {
		return this.config.name;
	}

	set name(str) {
		this.options.name = str;
	}

	createClient() {
		this.client = enet.createClient();
		this.client.enableCompression();

		this.emit("ready");
	}

	connect(address) {
		if(!this.client)
			this.createClient();

		address = parseURI(address);

		this.peer = this.client.connect({
			address: address[0],
			port: address[1]
		}, 1, 3);

		// "Server player"
		// Used to do block actions most part of time
		if (!this.game.players[32])
			this.game.players[32] = new Player();

		this.peer.on("connect", this.emit.bind(this, "connect"));
		this.peer.on("disconnect", this.emit.bind(this, "disconnect"));

		this.peer.on("message", (packet) => {
			this.readPacket(packet.data());
			this.emit("RawPacket", packet.data());
		});
	}

	readPacket(packet) {
		let PACKET = PACKETS[packet[0]] ?? EXTRAPACKETS[packet[0]];
		if(PACKET) {
			let Packet = new PACKET(packet);
			Packet.organize(this.game);
			this.emit(Packet.constructor.name, Packet.fields);
		}
	}

	sendPacket(packet) {
		packet = new enet.Packet(packet, enet.PACKET_FLAG.RELIABLE);
		this.peer.send(0, packet);
	}
}

module.exports = BaseClient;