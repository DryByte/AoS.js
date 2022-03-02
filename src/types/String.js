class StringType {
	constructor(max_chars=0) {
		this.value;
		this.max_chars = max_chars;
		this.type_size = max_chars;
	}

	read(buffer, offset=0) {
		this.value = buffer.toString("utf8", offset, offset+(this.max_chars||buffer.length))
		return this.value;
	}

	write(buffer, value, offset=0) {
		this.value = value;
		buffer.write(value, offset);
	}
}

module.exports = StringType;