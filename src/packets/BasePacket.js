class BasePacket {
	parseInfos(packet) {
		let offset = 1;

		for (let v in this.fields){
			this.fields[v].read(packet, offset);
			offset+=this.fields[v].type_size;
		}
	}

	encodeInfos() {
		let size = 0;
		for (let v in this.fields){
			size+=this.fields[v].type_size;
		}

		let packet = Buffer.alloc(size+1);
		let offset = 0;

		packet.writeUInt8(this.id, offset);
		offset+=1;

		for (let v in this.fields){
			this.fields[v].write(packet, this.fields[v].value, offset);
			offset+=this.fields[v].type_size;
		}

		return packet;
	}

	setValue(field, value) {
		this.fields[field].value = value;
	}

	organize(){}
}

module.exports = BasePacket;