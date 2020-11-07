const typeDetector = require("./type_detector");

/***************************
CONSTANTS
****************************/

const skipRowFactor = 0.25;
const skipColumnFactor = 0.04;

/***************************
EXPORT
****************************/

module.exports.parseSheet = function (sheet) {
	const attributes = new Attributes(sheet);
	if (!attributes.hasData) return { attributes, sheet };

	const rowInfo = getRowInfo(sheet);
	const skipcolumns = detectSkipColumns(sheet, rowInfo.maxRowLength);
	const dataSpan = detectDataSpan({
		maxColumnIndex: rowInfo.maxRowLength,
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

/***************************
FUNCTIONS
****************************/

function getRowInfo(sheet) {
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

function detectDataSpan({ maxColumnIndex, maxRowIndex, skiprows, skipcolumns }) {
	let beginRow = 0, beginColumn = 0, endRow = maxRowIndex - 1, endColumn = maxColumnIndex - 1;
	while (skiprows.includes(beginRow)) beginRow++;
	while (skipcolumns.includes(beginColumn)) beginColumn++;
	while (skiprows.includes(endRow)) endRow--;
	while (skipcolumns.includes(endColumn)) endColumn--;
	return {
		dataBeginAtRowIndex: beginRow,
		dataBeginAtColIndex: beginColumn,
		dataEndsAtRowIndex: endRow,
		dataEndsAtColIndex: endColumn,
	};
}

function collectColumnDescriptions(sheet, dataSpan) {
	const columnDescriptions = [];

	for (var columnIndex = dataSpan.dataBeginAtColIndex; columnIndex <= dataSpan.dataEndsAtColIndex; columnIndex++) {
		let dataType, year = null, month = null, dateTimeFormat = null;
		for (var rowIndex = dataSpan.dataBeginAtRowIndex + 1; rowIndex <= dataSpan.dataEndsAtRowIndex; rowIndex++) {
			const data = sheet.data[rowIndex][columnIndex];
			if (data == undefined) continue;
			dataType = typeDetector.detectData(data);
			if (dataType != 'datetime') break;

			const dateDetails = typeDetector.getDateDetails(data);
			if (rowIndex == dataSpan.dataBeginAtRowIndex + 1) {
				year = dateDetails.year; month = dateDetails.month; dateTimeFormat = dateDetails.dateTimeFormat;
			} else if (year != dateDetails.year) year = null;
			else if (month != dateDetails.month) month = null;
			else if (dateTimeFormat != dateDetails.dateTimeFormat) dateTimeFormat = null;

		}
		const title = sheet.data[dataSpan.dataBeginAtRowIndex][columnIndex];
		const dataContext = dataType == 'text' ? 'identifier' : 'values';

		const headerType = typeDetector.detectHeader(title);
		if (headerType == 'datetime') {
			const dateDetails = typeDetector.getDateDetails(title);
			year = dateDetails.year; month = dateDetails.month; dateTimeFormat = dateDetails.dateTimeFormat;
		}
		columnDescriptions.push({
			name: title,
			dataType: dataType,
			headerType: headerType,
			dataContext: dataContext,
			year: year,
			month: month,
			dateTimeFormat: dateTimeFormat,
		});
	}
	return columnDescriptions;
}

const getDefinedCount = row => row.filter(value => value != undefined).length;
const isSkipRow = (row, maxRowLength) => (getDefinedCount(row) == 0 || getDefinedCount(row) < skipRowFactor * maxRowLength);


function Attributes(sheet) {
	this.hasData = sheet.data.length > 0;
	this.columns = [];
	this.skiprows = [];
	this.skipcolumns = [];
	this.dataBeginAtRowIndex = -1;
	this.dataBeginAtColIndex = -1;
	this.dataEndsAtRowIndex = -1;
	this.dataEndsAtColIndex = -1;
}


