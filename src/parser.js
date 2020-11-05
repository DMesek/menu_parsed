
/***************************
EXPECTED OUTPUT TEMPLATES
****************************/


const expectedColDescription = {
	name: "colname", //column header name
	dataType: "", //text, datetime, integer, float
	headerType: "", //text, datetime
	dataContext: "identifier", //or values
	year: null, //if type=datetime
	month: null, //if type=datetime
	dateTimeFormat: null, //DD MM YYYY or DD/MM/YYYY (only if year and month are both null - general datetime series)
}



const expectedSheetDescription = {
	hasData: true, //or false
	columns: [expectedColDescription, expectedColDescription], //array of columns descriptions -> expectedColDescription
	dataBeginAtRowIndex: -1, //this should be detected
	dataBeginAtColIndex: -1, //this should be detected
	dataEndsAtRowIndex: -1, //this should be detected
	dataEndsAtColIndex: -1, //this should be detected
	skiprows: [], //rows with data out of context inside start/end area
	skipcolumns: [],
}


/***************************
FUNCTIONS
****************************/

const skipRowFactor = 0.25;
const skipColumnFactor = 0.04;

const getDefinedCount = row => row.filter(value => value != undefined).length;
const isSkipRow = (row, maxRowLength) => (getDefinedCount(row) == 0 || getDefinedCount(row) < skipRowFactor * maxRowLength);

function detectAttributes(sheet) {
	let isStartDetected = false;
	for (var rowIndex = 0; rowIndex < sheet.data.length; rowIndex++) {
		const row = sheet.data[rowIndex];
		if (!isStartDetected) {
			isStartDetected = true;
			expectedSheetDescription.dataBeginAtRowIndex = rowIndex;
			expectedSheetDescription.dataBeginAtColIndex = 0;
		}
	}

	return expectedSheetDescription;
}

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
		beginRow: beginRow,
		beginColumn: beginColumn,
		endRow: endRow,
		endColumn: endColumn,
	}
}

function detectSkipRows(sheet) {
	const skiprows = [];
	let maxRowLength = 0;
	for (var rowIndex = 0; rowIndex < sheet.data.length; rowIndex++) {
		const row = sheet.data[rowIndex];
		if (row.length > maxRowLength) maxRowLength = row.length;
		if (isSkipRow(row, maxRowLength)) skiprows.push(rowIndex);
	}
	return {
		skiprows: skiprows,
		maxRowLength: maxRowLength,
	};
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





/***************************
EXPORT
****************************/

module.exports.parseSheet = function (sheet) {
	const attributes = detectAttributes(sheet);
	const rowInfo = detectSkipRows(sheet);
	const skipcolumns = detectSkipColumns(sheet, rowInfo.maxRowLength);
	const dataSpan = detectDataSpan({
		maxColumnIndex: rowInfo.maxRowLength,
		maxRowIndex: sheet.data.length,
		skiprows: rowInfo.skiprows,
		skipcolumns: skipcolumns
	});
	attributes.skiprows = rowInfo.skiprows;
	attributes.skipcolumns = skipcolumns;
	attributes.dataBeginAtRowIndex = dataSpan.beginRow;
	attributes.dataBeginAtColIndex = dataSpan.beginColumn;
	attributes.dataEndsAtRowIndex = dataSpan.endRow;
	attributes.dataEndsAtColIndex = dataSpan.endColumn;
	return { attributes, sheet };
}