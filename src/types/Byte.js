/**
 * Byte Type
 * @category Types
 */
class ByteType {
	constructor(skip_bytes=0) {
		this.value;
		this.skip_bytes = skip_bytes;
		this.type_size = skip_bytes+1;
	}

	read(buffer, offset=0) {
		this.value = buffer.readInt8(offset);
		return this.value;
	}

	write(buffer, value, offset=0) {
		this.value = value;
		buffer.writeInt8(value, offset);
	}
}

module.exports = ByteType;