/**
 * UInt32 Type
 * @category Types
 */
class UInt32Type {
	constructor(skip_bytes=0) {
		this.value;
		this.skip_bytes = skip_bytes;
		this.type_size = skip_bytes+4;
	}

	read(buffer, offset=0) {
		this.value = buffer.readUInt32LE(offset);
		return this.value;
	}

	write(buffer, value, offset=0) {
		this.value = value;
		buffer.writeUInt32LE(value, offset);
	}
}

module.exports = UInt32Type;