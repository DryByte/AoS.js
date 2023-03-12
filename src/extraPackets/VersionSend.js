const BasePacket = require("../packets/BasePacket.js");
const { ByteType, StringType } = require("../types");

/**
 * Send version infos
 * @category Ext Packets
 * @extends {BasePacket}
 */
class VersionSend extends BasePacket {
	constructor(packet) {
		super();

		/**
		 * Packet Id
		 * @type Integer
		 */
		this.id = 34;

		/**
		 * Fields Object
		 * @property {ByteType} client_identifier ASCII Client Identifier
		 * @property {ByteType} version_major Major Version
		 * @property {ByteType} version_minor Minor Version
		 * @property {ByteType} version_revision Revision Version
		 * @property {StringType} os Operational System Infos
		 */
		this.fields = {
			client_identifier: new ByteType(),
			version_major: new ByteType(),
			version_minor: new ByteType(),
			version_revision: new ByteType(),
			os: new StringType(),
		};

		if (packet)
			this.parseInfos(packet);
	}

	organize(game) {
		game.local.sendVersion();
	}
}

module.exports = VersionSend;