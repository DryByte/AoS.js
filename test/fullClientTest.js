const AoS = require("../src");

describe("60s client test", function () {
	this.timeout(60000);

	it("This is supposed to run the client until he crashes.", () => {
		let client = new AoS.Client();

		client.on("ready", () => {
			console.log("Created the client!");
		});

		client.on("connect", () => {
			console.log("Client connected to the server!");
		});

		client.on("MapStart", (fields) => {
			console.log("Map start packet:");
			console.log(fields);
		});

		client.on("MapChunk", (fields) => {
			console.log("Map chunk packet:");
			console.log(fields);
		});

		client.on("StateData", (fields) => {
			console.log("State data packet:");
			console.log(fields);
		});

		client.on("ExistingPlayer", (fields) => {
			console.log("Existing player packet:");
			console.log(fields);
		});

		client.on("CreatePlayer", (fields) => {
			console.log("Create player packet:");
			console.log(fields);
		});

		client.on("PlayerLeft", (fields) => {
			console.log("Player left packet:");
			console.log(fields);
		});

		client.on("ChatMessage", (fields) => {
			console.log("Received a Message:");
			console.log(fields);
		});

		/*client.on("WorldUpdate", (fields) => {
			//We access client.game.players because have
			//better values and will display who is playing
			console.log("World update packet:");
			console.log(client.game.players);
		});*/
		/*client.on("rawPacket", (p) => {
			console.log(p[0])
		})*/

		client.connect("127.0.0.1:32887");
	})
})