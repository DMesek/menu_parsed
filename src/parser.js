const expectedColDescription = {
	name: "colname", //column header name
	dataType: "", //text, datetime, integer, float
	headerType: "", //text, datetime
	dataContext: "identifier", //or values
	year: null, //if type=datetime
	month: null, //if type=datetime
	dateTimeFormat: null, //DD MM YYYY or DD/MM/YYYY (only if year and month are both null - general datetime series)
}



/***************************
FUNCTIONS
****************************/

const skipRowFactor = 0.25;
const skipColumnFactor = 0.04;

const getDefinedCount = row => row.filter(value => value != undefined).length;
const isSkipRow = (row, maxRowLength) => (getDefinedCount(row) == 0 || getDefinedCount(row) < skipRowFactor * maxRowLength);

function detectDataSpan({ maxColumnIndex, maxRowIndex, skiprows, skipcolumns }) {
	let beginRow = 0;
	let beginColumn = 0;
	let endRow = maxRowIndex - 1;
	let endColumn = maxColumnIndex - 1;
	while (skiprows.includes(beginRow)) beginRow++;
	while (skipcolumns.includes(beginColumn)) beginColumn++;
	while (skiprows.includes(endRow)) endRow--;
	while (skipcolumns.includes(endColumn)) endColumn--;
	return {
		dataBeginAtRowIndex: beginRow, //this should be detected
		dataBeginAtColIndex: beginColumn, //this should be detected
		dataEndsAtRowIndex: endRow, //this should be detected
		dataEndsAtColIndex: endColumn,
	};
}

function detectSkipRows(sheet) {
	const skiprows = [];
	let maxColumnLength = 0;
	for (var rowIndex = 0; rowIndex < sheet.data.length; rowIndex++) {
		const row = sheet.data[rowIndex];
		if (row.length > maxColumnLength) maxColumnLength = row.length;
		if (isSkipRow(row, maxColumnLength)) skiprows.push(rowIndex);
	}
	return {
		skiprows: skiprows,
		maxColumnLength: maxColumnLength,
	}
}

function detectSkipColumns(sheet, maxRowLength) {
	let skipcolumns = [];
	for (var columnIndex = 0; columnIndex < maxRowLength; columnIndex++) {
		let definedCount = 0;
		for (var rowIndex = 0; rowIndex < sheet.data.length; rowIndex++) {
			if (sheet.data[rowIndex][columnIndex] != undefined) definedCount++;
		}
		if (definedCount < sheet.data.length * skipColumnFactor) skipcolumns.push(columnIndex);
	}
	return skipcolumns;
}

function collectColumnDescriptions(sheet, dataSpan) {
	const columnDescriptions = [];

	for (var columnIndex = dataSpan.dataBeginAtColIndex; columnIndex <= dataSpan.dataEndsAtColIndex; columnIndex++) {
		const title = sheet.data[dataSpan.dataBeginAtRowIndex][columnIndex];
		columnDescriptions.push(title);

		// for (var rowIndex = dataSpan.dataBeginAtRowIndex; rowIndex < dataEndsAtRowIndex; rowIndex++) {

		// }
	}
	return columnDescriptions;
}





/***************************
EXPORT
****************************/

module.exports.parseSheet = function (sheet) {
	const attributes = {
		hasData: sheet.data.length > 0,
		columns: [], //array of columns descriptions -> expectedColDescription
		dataSpan: {},
		skiprows: [], //rows with data out of context inside start/end area
		skipcolumns: [],
	};
	if (!attributes.hasData) return { attributes, sheet };

	const rowInfo = detectSkipRows(sheet);
	const skipcolumns = detectSkipColumns(sheet, rowInfo.maxColumnLength);
	const dataSpan = detectDataSpan({
		maxColumnIndex: rowInfo.maxColumnLength,
		maxRowIndex: sheet.data.length,
		skiprows: rowInfo.skiprows,
		skipcolumns: skipcolumns
	});
	attributes.dataSpan = dataSpan;
	attributes.skiprows = rowInfo.skiprows;
	attributes.skipcolumns = skipcolumns;
	attributes.columns = collectColumnDescriptions(sheet, dataSpan);
	return { attributes, sheet };
}