/**
 * Base class for packets
 * @category Packets
 */
class BasePacket {
	/**
	 * Read a packet and assign the values for fields.
	 * @param {Buffer} Packet
	 */
	parseInfos(packet) {
		let offset = 1;

		for (let v in this.fields){
			this.fields[v].read(packet, offset);
			offset+=this.fields[v].type_size;
		}
	}

	/**
	 * Write all fields to the buffer.
	 * @returns {Buffer}
	 */
	encodeInfos() {
		let size = 0;
		for (let v in this.fields){
			size+=this.fields[v].type_size;
		}

		let packet = Buffer.alloc(size+1);
		let offset = 0;

		if (typeof this.id == "undefined") {
			packet.writeUInt8(this.id, offset);
			offset+=1;
		}

		for (let v in this.fields){
			this.fields[v].write(packet, this.fields[v].value, offset);
			offset+=this.fields[v].type_size;
		}

		return packet;
	}

	/**
	 * Set a fields's value
	 * @param {string} Field Field's name
	 * @param {any} Value Field's value
	 */
	setValue(field, value) {
		this.fields[field].value = value;
	}

	/**
	 * Get a field's value
	 * @param {string} Field Field's name
	 * @returns {string}
	 */
	getValue(field) {
		return this.fields[field].value;
	}

	/**
	 * This function is used for packets organize infos inside game's class
	 * @param {Game} Game Game Class
	 */
	organize(){}
}

module.exports = BasePacket;