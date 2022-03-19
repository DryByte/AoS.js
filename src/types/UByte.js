class UByteType {
	constructor(skip_bytes=0) {
		this.value;
		this.skip_bytes = skip_bytes;
		this.type_size = skip_bytes+1;
	}

	read(buffer, offset=0) {
		this.value = buffer.readUInt8(offset);
		return this.value;
	}

	write(buffer, value, offset=0) {
		this.value = value;
		buffer.writeUInt8(value, offset);
	}
}

module.exports = UByteType;