const assert = require("assert");
const AoS = require("../src");

describe("Client creation test", () => {
	it("Should create a new client class then change his name.", (done) => {
		let client = new AoS.Client();

		client.on("ready", () => {
			assert.strictEqual(client.name, "Deuce");

			client.name = "NotDeuce";
			assert.strictEqual(client.name, "NotDeuce");
			done();
		});

		client.createClient();
	})
});