const assert = require("assert");
const AoS = require("../src");

describe("Utils file test", () => {
	describe("Merge Obj test", () => {
		let { mergeObj } = AoS.Utils;
		it("Merge simple base object with another one.", () => {
			const baseObj = {
				me: "a",
				mom: "b",
				children: "c"
			};

			const toMerge = {
				mom: "f"
			}

			assert.deepStrictEqual(mergeObj(baseObj, toMerge),
								  {me: "a", mom:"f", children: "c"}
			);
		});
	});

	describe("Parse URI tests", () => {
		let { parseURI } = AoS.Utils;
		it("Using normal ip, should return array: [127.0.0.1, 32887]", () =>{
			assert.deepStrictEqual(parseURI("127.0.0.1:32887"), ["127.0.0.1", "32887"]);
		});

		it("Using AoS protocol with ip, should return array: [127.0.0.1, 32887]", () =>{
			assert.deepStrictEqual(parseURI("aos://127.0.0.1:32887"), ["127.0.0.1", "32887"]);
		});

		it("Using AoS URI, should return array: [127.0.0.1, 32887]", () =>{
			assert.deepStrictEqual(parseURI("aos://16777343:32887"), ["127.0.0.1", "32887"]);
		});
	});
});