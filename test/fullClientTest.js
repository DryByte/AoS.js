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

		client.connect("127.0.0.1:32887");
	})
})