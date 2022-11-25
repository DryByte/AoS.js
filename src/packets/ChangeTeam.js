const BasePacket = require("./BasePacket.js");
const { UByteType, ByteType } = require("../types");

class ChangeTeam extends BasePacket {
	constructor(packet) {
		super();

		this.id = 29;
		this.fields = {
			player_id:    new UByteType(),
			team_id:      new ByteType(),
		};

		if (packet)
			this.parseInfos(packet);
	}
}

module.exports = ChangeTeam;