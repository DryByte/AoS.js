const BasePacket = require("./BasePacket.js");
const { UByteType, LEIntType } = require("../types");

class BlockAction extends BasePacket {
	constructor(packet) {
		super();

		this.id = 13;
		this.fields = {
			player_id:        new UByteType(),
			action_type:      new UByteType(),
			x:                new LEIntType(),
			y:                new LEIntType(),
			z:                new LEIntType()
		};

		if (packet)
			this.parseInfos(packet);
	}

	organize(game) {
		let pId = this.getValue("player_id");

		if (pId > 31)
			pId = 32;

		if (!game.players[pId])
			return;

		let x = this.getValue("x"),
			y = this.getValue("y"),
			z = this.getValue("z");

		switch(this.getValue("action_type")) {
		// build
		case 0:
			if (pId < 32)
				game.players[pId].blocks -= game.players[pId].blocks<=0 ? 0 : 1;

			var color = game.players[pId].blockColor;

			game.map.addBlock({
				position: {x,y,z},
				color: {r: color[0], g: color[1], b: color[2]}
			});

			break;
			// bullet/spade destroy
		case 1:
			if (pId < 32)
				game.players[pId].blocks += game.players[pId].blocks>=50 ? 50 : 1;

			game.map.removeBlock(x,y,z);
			break;
			// spade right click destroy
		case 2:
			game.map.removeBlock(x,y,z-1);
			game.map.removeBlock(x,y,z);
			game.map.removeBlock(x,y,z+1);
			break;
			// grenade
		case 3:
			for (let xa of new Array(3).keys()) {
				for (let ya of new Array(3).keys()) {
					for (let za of new Array(3).keys()) {
						game.map.removeBlock(x+xa-1,y+ya-1,z+za-1);
					}
				}
			}

			break;
		}
	}
}

module.exports = BlockAction;