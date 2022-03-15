class LEIntType {
	constructor(skip_bytes=0) {
		this.value;
		this.skip_bytes = skip_bytes;
		this.type_size = skip_bytes+4;
	}

	read(buffer, offset=0) {
		this.value = buffer.readIntLE(offset, 4);
		return this.value;
	}

	write(buffer, value, offset=0) {
		this.value = value;
		buffer.writeIntLE(value, offset);
	}
}

module.exports = LEIntType;