module.exports = {
	mergeObj: (base_obj, merge_obj) => {
		let r_obj = {};

		// copy
		for (let key in base_obj) {
			r_obj[key] = base_obj[key];
		}

		for (let key in merge_obj) {
			r_obj[key] = merge_obj[key];
		}

		return r_obj;
	},
	parseURI: (address) => {
		if(!address.startsWith("aos://"))
			return address.split(":");

		address = address.slice("aos://".length);
		let addr_split = address.split(":");

		if(addr_split[0].split(".")[1])
			return addr_split;

		let ip = addr_split[0];
		addr_split[0] = `${ip&255}.${(ip>>8)&255}.${(ip>>16)&255}.${(ip>>24)&255}`;

		return addr_split;
	}
};