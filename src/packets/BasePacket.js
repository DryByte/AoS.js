class BasePacket {
	parseInfos(packet) {
		let offset = 1;

		for (let v in this.fields){
			switch(this.fields[v].type) {
				case "string":
					this.fields[v].value = packet.toString('utf8', offset);
					break;
				case "byte":
					this.fields[v].value = packet.readInt8(offset);
					offset+=1;
					break;
				case "ubyte":
					this.fields[v].value = packet.readUInt8(offset);
					offset+=1;
					break;
				case "le float":
					this.fields[v].value = packet.readFloatLE(offset);
					offset+=4;
					break;
				case "uint32":
					this.fields[v].value = packet.readUInt32LE(offset);
					offset+=4;
					break;
			}
		}
	}
}

module.exports = BasePacket;