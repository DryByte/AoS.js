exports.Client = require(__dirname+"/client/Client.js");
exports.Utils = require(__dirname+"/utils.js");
exports.VXL = require(__dirname+"/vxl/VXL.js");
exports.Types = require(__dirname+"/types");

// POG part, need to change later...
const fs = require("fs");
let packetsNames = fs.readdirSync(__dirname+"/packets");
let packetsObj = {};

for (let name of packetsNames) {
	packetsObj[name.slice(0, -3)] = require(__dirname+`/packets/${name}`);
}

exports.Packets = packetsObj;