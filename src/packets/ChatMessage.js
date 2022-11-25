const BasePacket = require("./BasePacket.js");
const { UByteType, StringType } = require("../types");

class ChatMessage extends BasePacket {
	constructor(packet) {
		super();

		this.id = 17;
		this.fields = {
			player_id:    new UByteType(),
			chat_type:    new UByteType(),
			chat_message: new StringType(),
		};

		if (packet)
			this.parseInfos(packet);
	}
}

module.exports = ChatMessage;