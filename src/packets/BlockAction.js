const BasePacket = require("./BasePacket.js");
const { UByteType, LEIntType } = require("../types");

class BlockAction extends BasePacket {
	constructor(packet) {
		super()

		this.fields = {
			player_id:        new UByteType(),
			action_type:      new UByteType(),
			x:                new LEIntType(),
			y:                new LEIntType(),
			z:                new LEIntType()
		}

		if (packet)
			this.parseInfos(packet);
	}

	organize(game) {
		let pId = this.fields.player_id.value;
		if (!game.players[pId] && pId < 32)
			return;

		let x = this.fields.x.value,
			y = this.fields.y.value,
			z = this.fields.z.value;

		switch(this.fields.action_type.value) {
			// build
			case 0:
				if (pId < 32)
					game.players[pId].blocks -= game.players[pId].blocks<=0 ? 0 : 1;

				let color = game.players[pId].blockColor;

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
							game.map.removeBlock(x+xa-1,y+ya-1,z+za-1)
						}
					}
				}

				break;
		}
	}
}

module.exports = BlockAction;