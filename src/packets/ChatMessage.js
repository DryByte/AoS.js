const BasePacket = require("./BasePacket.js");

class ChatMessage extends BasePacket {
	constructor(packet) {
		super()

		this.fields = {
			player_id:    {type: "ubyte", value: 0},
			chat_type:    {type: "ubyte", value: 0},
			chat_message: {type: "string", value: ""},
		};

		if (packet)
			this.parseInfos(packet);
	}
}

module.exports = ChatMessage;