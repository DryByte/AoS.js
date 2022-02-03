const AoS = require("../src");

describe("Client creation test", () => {
	it("Connect to local server and receive state data packet.", (done) => {
		let client = new AoS.Client();

		client.on("rawPacket", (packet) => {
			if(packet[0] == 15){
				done();
				process.exit(0);
			}
		});

		client.connect("127.0.0.1:32887");
	})
});