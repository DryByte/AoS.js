const AoS = require("../src");
let client = new AoS.Client({name: "AsterBot"});

client.on("ready", () => {
	console.log("Created the client!");
});

client.on("connect", () => {
	console.log("Client connected to the server!");
	setInterval(followLoop, 30);
});

client.on("StateData", (fields) => {
	client.joinGame();

	client.sendMessage("Available commands: !follow, !nohomo and !switch", 0);
});

let followingId = undefined;
function followLoop() {
	if(followingId === undefined)
		return;

	if(followingId != client.localPlayerId && client.game.players[followingId]){
		let p_pos = client.game.players[followingId].position;
		client.lookAt(p_pos.x,p_pos.y,p_pos.z);
	}
}

client.on("ChatMessage", (fields) => {
	switch(fields.chat_message.value) {
		case '!follow\x00':
			followingId = fields.player_id.value;
			console.log(`Started to follow: ${client.game.players[followingId].name}.`);
			client.sendMessage(`/pm #${followingId} Now i will start following you.`, 1);
			break;
		case '!getout\x00':
			client.sendMessage("Bye bye :(", 0);
			client.disconnect();
			break;
		case '!nohomo\x00':
			client.sendLines([
				"Im not gay but i want to suck a cock. Cocks look so juicy and tasty",
				"when you think about it. Just imagine slurping up and",
				"down a warm throbbing cock as a man stronger and bigger",
				"than you pats your head and calls you a good boy.",
				"Im entirely straight. I just have a penis fetish."
			], 0, 3500);
			break;
		case '!switch\x00':
			let team = client.game.players[client.localPlayerId].team.id;
			let next_team = team;
			if (team >= -1 && team < 1) {
				next_team += 1;
			} else {
				next_team = -1;
			}

			client.changeTeam(next_team);
			client.sendMessage("Changing team.", 0);
			break;
		case '!smg\x00':
			client.changeWeapon(1);
			break;
	}
});

client.connect("aos://127.0.0.1:32887");