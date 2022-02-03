const enet = require("enet");
const EventEmitter = require("events");

const Game = require("../game/Game.js");
const { version } = require("../../package.json");
const { parseURI, mergeObj } = require("../utils.js");
const PACKETS = require("../packets/EPacketHandler.js");

const defaultOptions = {
	name: "Deuce",

	client_identifier: "C",
	client_v_major: version.split(".")[0],
	client_v_minor: version.split(".")[1],
	client_v_revision: version.split(".")[2],
	client_v_info: "AoS.js",
}

class Client extends EventEmitter {
	constructor(options) {
		super();

		let defOpt = defaultOptions;
		if (options)
			defOpt = mergeObj(defaultOptions, options);

		this.options = defOpt;

		this.game = new Game();
		this.client;
		this.peer;
	}

	get name() {
		return this.options.name;
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

        this.peer.on("connect", this.emit.bind(this, "connect"));
        this.peer.on("disconnect", this.emit.bind(this, "disconnect"));

        this.peer.on("message", (packet, chan) => {
        	readPacket(packet.data());
        	this.emit("rawPacket", packet.data());
        })
	}

	readPacket(packet) {
		if(PACKETS[packet.data()[0]])
			PACKETS[packet.data()[0]](packet.data());
	}
}

module.exports = Client;