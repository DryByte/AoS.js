class BasePacket {
	parseInfos(packet) {
		let offset = 1;

		for (let v in this.fields){
			this.fields[v].read(packet, offset);
			offset+=this.fields[v].type_size;
		}
	}

	organize(){}
}

module.exports = BasePacket;