const AoS = require("../src");
let client = new AoS.Client();
const fs = require("fs")

client.on("connect", () => {
	console.log("Client connected to the server!");
});

client.on("StateData", (fields) => {
	let a = Date.now();
	console.log("Lets do it");
	let c = client.game.map.saveVXL();
	console.log(`Done in: ${Date.now()-a}`)
	console.log(c)

	fs.writeFileSync("test.vxl", c);
});

client.connect("aos://127.0.0.1:32887");