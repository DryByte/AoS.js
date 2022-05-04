const AoS = require("../src");
let client = new AoS.Client({name: "ChatBot"});

client.on("ready", () => {
	console.log("Created the client!");
});

client.on("connect", () => {
	console.log("Client connected to the server!");
	setInterval(followLoop, 200);
});

client.on("StateData", (fields) => {
	client.joinGame();

	client.sendMessage("Available commands: !follow", 0);
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
	}
});

client.connect("aos://16777343:32887");