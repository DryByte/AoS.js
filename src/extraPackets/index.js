const fs = require("fs");
let packetsNames = fs.readdirSync(__dirname);
let packetsObj = {};

for (let name of packetsNames) {
	if (name == "index.js")
		continue;

	let packet = require(__dirname+`/${name}`);
	let packetClass = new packet();

	packetsObj[packetClass.id] = packet;
	packetClass = null;
}

module.exports = packetsObj;