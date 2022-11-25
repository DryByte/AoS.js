const {loadImage,createCanvas} = require("canvas");

const AoS = require("../src");
const OrientationData = AoS.Packets.OrientationData;
let client = new AoS.Client({
	name: "HentaiBuilder"
});

client.on("ready", () => {
	console.log("Created the client!");
});

client.on("connect", () => {
	console.log("Client connected to the server!");
});

client.on("StateData", (fields) => {
	client.joinGame({
		team: 1
	});

	// Anti afk in cool way (bigger head, small head, etc head)
	setInterval(() => {
		let ori_p = new OrientationData();
		ori_p.setValue("x", Math.random() * (Math.random()<0.5?-1:1));
		ori_p.setValue("y", Math.random() * (Math.random()<0.5?-1:1));
		ori_p.setValue("z", Math.random() * (Math.random()<0.5?-1:1));

		let send_packet = ori_p.encodeInfos();
		client.sendPacket(send_packet);
	}, 50);
	setTimeout(startBuilding, 5000);
});

function sleep(ms) {
	return new Promise((resolve) => {
		setTimeout(resolve, ms);
	});
}

async function startBuilding() {
	let image = await loadImage("./test/images_to_build/logo1.png");
	let canvas = createCanvas(image.width, image.height);
	let ctx = canvas.getContext("2d");
	ctx.drawImage(image,0,0);

	let currentImgCoords = {x:0,y:0};
	let localPlayer = client.game.players[client.localPlayerId];
	let startPos = {};

	startPos.x = Math.floor(localPlayer.position.x);
	startPos.y = Math.floor(localPlayer.position.y);

	setTimeout(() => {
		client.setTool(1); //block
	}, 150);

	let z = client.game.map.getTopCoordinate(startPos.x+currentImgCoords.x,startPos.y+currentImgCoords.y)-1;
	while (true) {

		if (currentImgCoords.x >= image.width) {
			break;
		}

		if (currentImgCoords.y >= image.height) {
			currentImgCoords.x+=1;
			client.setWalkInputs({up: true});
			await sleep(110);
			client.setWalkInputs();
		}

		if (currentImgCoords.y <= 1 && currentImgCoords.x % 2) {
			currentImgCoords.x+=1;
			client.setWalkInputs({up: true});
			await sleep(100);
			client.setWalkInputs();
		}

		let colorData = ctx.getImageData(currentImgCoords.x,currentImgCoords.y,1,1).data;
		client.setColor(colorData[0],colorData[1],colorData[2]);
		client.placeBlock(startPos.x+currentImgCoords.x,startPos.y+currentImgCoords.y,z);
		client.setPosition(startPos.x+currentImgCoords.x,startPos.y+currentImgCoords.y,z-1);

		if (currentImgCoords.x % 2){
			client.setWalkInputs({left: true});
			await sleep(140);
			client.setWalkInputs();
			await sleep(600)

			currentImgCoords.y-=1;
		} else{
			client.setWalkInputs({right: true});
			await sleep(140);
			client.setWalkInputs();
			await sleep(600)

			currentImgCoords.y+=1;
		}
	}
}

client.connect("aos://127.0.0.1:32887");
