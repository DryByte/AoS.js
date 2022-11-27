const AoS = require("../src");
const {createCanvas} = require("canvas");
const fs = require("fs");

let client = new AoS.Client();

function createMap() {
	const canvas = createCanvas(512, 512);
	const ctx = canvas.getContext("2d");

	for (let x = 0; x < 512; x++) {
		for (let y = 0; y < 512; y++) {
			
			let block = client.game.map.getTopBlock(x,y);

			ctx.beginPath();
			ctx.fillStyle = `rgb(${block.color.r}, ${block.color.g}, ${block.color.b})`;
			ctx.fillRect(x, y, 1, 1);
			ctx.fill();

		}
	}

	for(let i = 0;i<32;i++) {
		let player = client.game.players[i];
		console.log(player);
		if (!player)
			continue;
		let team = client.game.players[i].team;
		if (!team)
			continue;

		ctx.beginPath();
		ctx.fillStyle = `rgb(${team.color[0]},${team.color[1]},${team.color[2]})`;
		ctx.fillRect(player.position.x, player.position.y, 5, 5);
		ctx.fill();
	}

	const b = canvas.toBuffer('image/png');
	fs.writeFileSync(`./test/maps/map_${Date.now()}.png`, b);
	console.log(`Created map: ${Date.now()}`);
}

client.on("ready", () => {
	console.log("Created the client!");
});

client.on("connect", () => {
	console.log("Client connected to the server!");
});

client.on("StateData", (fields) => {
	createMap(true);
	setInterval(createMap, 15000);
});

client.on("BlockAction", (fields) => {
	if (fields.player_id.value < 32) {
		console.log(`${client.game.players[fields.player_id.value].name} did a block action at: ${fields.x.value}, ${fields.y.value}, ${fields.z.value}`);
	}
});

client.on("BlockLine", (fields) => {
	if (fields.player_id.value < 32) {
		console.log(fields);
	}
})

client.connect("aos://16777343:32887");

process.on('SIGINT', function() {
	console.log("Cleaning maps directory...");

	let maps = fs.readdirSync("./test/maps");

	for (let _map of maps) {
		if(_map.endsWith(".png")) {
			fs.unlinkSync(`./test/maps/${_map}`);
		}
	}

	process.exit();
});