const AoS = require("../src");
let client = new AoS.Client({name: "Gunman"});

client.on("StateData", (fields) => {
	client.joinGame({
		team: 1,
		weapon: 0
	});

	console.log("Joined in a team.");
	console.log("Trying to send a custom reload.");

	client.sendCustomReload(53, 69)

	setInterval(tryKilling, 500);
});

client.on("WeaponReload", (fields) => {
	console.log(`Received weapon reload for: ${fields.player_id.value} with clip: ${fields.clip.value} and reserve: ${fields.reserve.value}`);
});

function sleep(ms) {
	return new Promise((resolve) => {
		setTimeout(resolve, ms);
	});
}

async function tryKilling() {
	let localPlayer = client.game.players[client.localPlayerId];
	let ori = localPlayer.orientation;
	let pos = localPlayer.position;

	let canfire = false;
	let id_tofire = 0;
	for await (let player of client.game.players) {
		if (!player) continue;
		if (Math.round(player.position.x) != Math.round(pos.x)) continue;
		if (player.playerId == localPlayer.playerId) continue;

		id_tofire = player.playerId;
		canfire = true;
		break;
	}

	if (!canfire) return;

	client.toggleFiring();
	client.hitPlayer(id_tofire, 1);
	console.log(`Shot on ID: ${id_tofire}`);

	await sleep(100);
	client.toggleFiring();
}

client.on("KillAction", fields => {
	console.log(fields);

	let player = client.game.players[fields.player_id.value];
	let killer = client.game.players[fields.killer_id.value];

	console.log(player, killer);
});

client.on("CreatePlayer", fields => {
	console.log(`Respawn ${fields.player_id.value}`);
	let player = client.game.players[fields.player_id.value];
	console.log(player);
});

client.connect("127.0.0.1:32887");