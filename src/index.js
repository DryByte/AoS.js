exports.Client = require("./client/Client.js");
exports.Utils = require("./utils.js");
exports.VXL = require("./vxl/VXL.js");
exports.Types = require("./types");

// POG part, need to change later...
const fs = require("fs");
let packetsNames = fs.readdirSync("./src/packets");
let packetsObj = {};

for (let name of packetsNames) {
	packetsObj[name.slice(0, -3)] = require(`./packets/${name}`);
}

exports.Packets = packetsObj;