class BasePacket {
	parseInfos(packet) {
		let offset = 1;

		for (let v in this.fields){
			switch(this.fields[v].type) {
				case "string":
					this.fields[v].value = packet.toString('utf8', offset, offset+(this.fields[v].max_chars||packet.length));
					offset+=this.fields[v].max_chars||32;
					break;
				case "byte":
					this.fields[v].value = packet.readInt8(offset);
					offset+=this.fields[v].skip_bytes+1||1;
					break;
				case "ubyte":
					this.fields[v].value = packet.readUInt8(offset);
					offset+=this.fields[v].skip_bytes+1||1;
					break;
				case "le float":
					this.fields[v].value = packet.readFloatLE(offset);
					offset+=this.fields[v].skip_bytes+4||4;
					break;
				case "uint32":
					this.fields[v].value = packet.readUInt32LE(offset);
					offset+=this.fields[v].skip_bytes+4||4;
					break;
			}
		}
	}

	organize(){}
}

module.exports = BasePacket;