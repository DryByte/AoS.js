const AoS = require("../src");
const {createCanvas} = require("canvas");
const fs = require("fs");

describe("Generate a full map image", function () {
	this.timeout(60000);

	it("Should create an image at root project directory, having the current VXL map.", () => {
		let client = new AoS.Client();

		client.on("ready", () => {
			console.log("Created the client!");
		});

		client.on("connect", () => {
			console.log("Client connected to the server!");
		});

		client.on("StateData", (fields) => {
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

			const b = canvas.toBuffer('image/png');
			fs.writeFileSync("./map.png", b);
			console.log("Map process is done :D");
		});

		client.connect("127.0.0.1:32887");
	})
})