
const { parseSheet } = require("./parser.js");
const { convertToUnifiedFormat } = require("./utils.js");

const myArgs = process.argv.slice(2); //first two arguments are node and exec file path
const filePath = myArgs[0];
const unifiedData = convertToUnifiedFormat(filePath);

for (var i = 0; i < unifiedData.length; i++) {
	var sheetInfo = parseSheet(unifiedData[i]);
	// console.log(sheetInfo.attributes.columns.map(c => c.year));
}


