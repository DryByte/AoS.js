const BasePacket = require("./BasePacket.js");
const { UByteType, StringType } = require("../types");

/**
 * @category Packets
 * @extends {BasePacket}
 */
class ChatMessage extends BasePacket {
	constructor(packet) {
		super();

		/**
		 * Packet Id
		 * @type Integer
		 */
		this.id = 17;

		/**
		 * Fields Object
		 * @property {UByteType} player_id Player's id
		 * @property {UByteType} chat_type Chat Type to send the message
		 * @property {StringType} chat_message Chat Message to send
		 */
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