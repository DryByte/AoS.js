class StringType {
	constructor(max_chars=0) {
		this._value;
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

	set value(str) {
		this._value = str;
		this.max_chars = str.length;
		this.type_size = str.length;
	}

	get value() {
		return this._value;
	}
}

module.exports = StringType;